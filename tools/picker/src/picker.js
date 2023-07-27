import React, { useEffect, useState } from 'react';

import { defaultTheme, Provider, ListView, Item, Text, Image, Breadcrumbs, ActionButton, Flex, Picker as RSPicker, View } from '@adobe/react-spectrum';
import Folder from '@spectrum-icons/illustrations/Folder';
import Copy from '@spectrum-icons/workflow/Copy';

const Picker = props => {
    const { blocks, getPath, getItems, rootCategoryKey } = props;

    const [state, setState] = useState({
        items: {},
        folder: rootCategoryKey,
        path: [],
        loadingState: 'loading',
        block: null,
        disabledKeys: new Set(),
        selectedItems: new Set(),
    });

    const clickListItem = (key) => {
        const item = state.items[key];
        if (item.isFolder) {
            selectFolder(key);
        }
    }

    const selectFolder = (key) => {
        setState(state => ({
            ...state,
            items: {},
            folder: key,
            loadingState: 'loading',
        }));
    };

    const selectItems = (items) => {
        setState(state => ({
            ...state,
            selectedItems: items,
        }));
    };

    const copyToClipboard = key => {
        if (!state.block) {
            return;
        }

        let item = null;
        if (key instanceof Set) {
            item = [...key].map(k => state.items[k]);
        } else {
            item = state.items[key];
        }

        const html = blocks[state.block].output(item);
        navigator.clipboard.write([
            new ClipboardItem({
                'text/plain': new Blob([ html ], { type: 'text/plain' }),
                'text/html': new Blob([ html ], { type: 'text/html' }),
            }),
        ]);
    };

    const calculateDisabledKeys = (block, items) => {
        // Disable item or folder depending on the block type
        const disabledKeys = new Set();
        if (block.type === 'item' && block.selection === 'multiple') {
            Object.values(items).filter(i => i.isFolder).forEach(i => disabledKeys.add(i.uid));
        } else if (block.type === 'folder' && block.selection === 'multiple') {
            Object.values(items).filter(i => !i.isFolder).forEach(i => disabledKeys.add(i.sku));
        }

        return disabledKeys;
    };

    const selectBlock = block => {
        setState(state => {
            const blockObj = blocks[block];
            const disabledKeys = calculateDisabledKeys(blockObj, state.items);

            return {
                ...state,
                // This triggers a re-render of the list
                items: structuredClone(state.items),
                block,
                disabledKeys,
                selectedItems: new Set(),
            }
        });
    };

    useEffect(() => {
        (async () => {
            let newItems = await getItems(state.folder);
            let newPath = await getPath(state.folder, rootCategoryKey);

            setState(state => {
                const blockObj = state.block ? blocks[state.block] : {};
                const disabledKeys = calculateDisabledKeys(blockObj, newItems);

                return {
                    ...state,
                    items: newItems,
                    path: newPath,
                    disabledKeys,
                    loadingState: 'idle',
                }
            });
        })();
    }, [state.folder]);

    // TODO: Search
    // TODO: Pagination

    const currentBlock = blocks[state.block] || {};

    return <Provider theme={defaultTheme} height="100%">
        <Flex direction="column" height="100%">
            <View padding="size-100">
                <Flex direction="row" gap="size-100">
                    <RSPicker width="100%" items={Object.values(blocks)} aria-label="Select a block" placeholder="Select a block" selectedKey={state.block} onSelectionChange={selectBlock}>
                        {block => (
                            <Item key={block.key}>
                                {block.name}
                            </Item>
                        )}
                    </RSPicker>
                    {currentBlock.selection === 'multiple' && <ActionButton isDisabled={state.selectedItems.size === 0} aria-label="Copy" onPress={() => copyToClipboard(state.selectedItems)}><Copy /></ActionButton>}
                </Flex>
            </View>
            <Breadcrumbs onAction={selectFolder}>
                {state.path.map(c => <Item key={c.key}>{c.name}</Item>)}
            </Breadcrumbs>
            <ListView aria-label="List of Items" items={Object.values(state.items)} loadingState={state.loadingState} width="100%" height="100%" density="spacious" selectionMode={currentBlock.selection === 'multiple' ? 'multiple' : 'none'} onAction={clickListItem} selectedKeys={state.selectedItems} onSelectionChange={selectItems} disabledKeys={state.disabledKeys}>
                {item => {
                    if (item.isFolder) {
                        // is Folder
                        return <Item key={item.key} textValue={item.name} hasChildItems>
                            <Folder />
                            <Text>{item.name}</Text>
                            {item.childCount > 0 && <Text slot="description">{item.childCount} items</Text>}
                            {currentBlock.selection === 'single' && (currentBlock.type === 'any' || currentBlock.type === 'folder') && <ActionButton aria-label="Copy" onPress={() => copyToClipboard(item.key)}><Copy /></ActionButton>}
                        </Item>
                    }

                    return <Item key={item.key} textValue={item.name}>
                        {item.thumbnail && <Image src={item.thumbnail.url} alt={item.thumbnail.label} />}
                        <Text>{item.name}</Text>
                        {currentBlock.selection === 'single' && (currentBlock.type === 'any' || currentBlock.type === 'item') && <ActionButton aria-label="Copy" onPress={() => copyToClipboard(item.key)}><Copy /></ActionButton>}
                    </Item>;
                }}
            </ListView>
        </Flex>
    </Provider>;
}

export default Picker;