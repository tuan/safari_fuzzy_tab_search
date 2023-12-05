import withSuspense from '@src/shared/hoc/withSuspense';
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary';
import { useEffect } from 'react';
import { useState } from 'react';
import { useCombobox } from 'downshift';
import { useMemo } from 'react';
import { Fzf, byStartAsc } from 'fzf';
import type { FzfResultItem } from 'fzf';
import HighlightChars from './HighlightChars';

type Tab = {
  id: number;
  title: string;
};

async function fetchTabs(): Promise<Tab[]> {
  const chromeTabs = await chrome.tabs.query({ currentWindow: true });

  return chromeTabs
    .filter(tab => tab.id != null && tab.title != null && tab.url != null && tab.title.length > 0)
    .map(tab => ({ id: tab.id, url: tab.url, title: tab.title }));
}

const Popup = () => {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [keyword, setKeyword] = useState<string>('');

  useEffect(() => {
    async function getTabs() {
      try {
        const tabs = await fetchTabs();
        setTabs(tabs);
      } catch (error) {
        console.log(`Failed to fetch tabs. Reason: ${error}`);
      }
    }
    getTabs();
  }, []);

  const fzf = useMemo(
    () =>
      new Fzf(tabs, {
        selector: item => item.title,
        tiebreakers: [byStartAsc],
        fuzzy: 'v1',
      }),
    [tabs],
  );

  const fzfResultItems = useMemo(() => fzf.find(keyword), [keyword, fzf]);

  const { getMenuProps, getInputProps, highlightedIndex, getItemProps, selectedItem } = useCombobox({
    onInputValueChange({ inputValue }) {
      setKeyword(inputValue);
    },
    items: fzfResultItems,
    // this is the string that shows in the combo box after an item is selected
    itemToString: fzfResultItem => fzfResultItem.item.title,
    onSelectedItemChange({ selectedItem: fzfResultItem }) {
      chrome.tabs.update(fzfResultItem.item.id, { active: true });
      const popups = chrome.extension.getViews({ type: 'popup' });
      popups.forEach(popup => popup.close());
    },
    defaultHighlightedIndex: 0,
  });

  return (
    <div className="flex flex-col w-96 p-2 bg-gray-100">
      <input
        placeholder="Enter keyword or ⌘ + ⌃ + T to toggle"
        className="py-1 px-1 rounded focus:outline-none text-sm"
        {...getInputProps()}
      />
      <ul className="mt-1 max-h-80 overflow-scroll" {...getMenuProps()}>
        {fzfResultItems.map((fzfResultItem, index) => (
          <li
            key={fzfResultItem.item.id}
            className={getListItemClassnames(selectedItem, highlightedIndex, fzfResultItem, index)}
            {...getItemProps({ item: fzfResultItem, index })}>
            <span className="text-sm text-gray-700">
              <HighlightChars str={fzfResultItem.item.title} indices={fzfResultItem.positions} />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

function getListItemClassnames(
  selectedItem: FzfResultItem<Tab>,
  highlightedIndex: number,
  item: FzfResultItem<Tab>,
  index: number,
): string {
  let result: string[] = ['py-2', 'px-1', 'rounded', 'h-10', 'align-middle', 'truncate'];
  if (selectedItem === item) {
    result.push('font-bold');
  }

  if (highlightedIndex === index) {
    result.push('bg-blue-300');
  }

  return result.join(' ');
}

export default withErrorBoundary(
  withSuspense(Popup, <div className="w-96"> Loading ... </div>),
  <div className="w-96 place-content-center"> Error Occur </div>,
);
