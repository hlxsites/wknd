import React, {useEffect, useState} from 'react';
import {ProgressCircle, Flex, ListView, Item, ActionMenu, ActionButton, Text, Content, Heading, IllustratedMessage} from '@adobe/react-spectrum';
import Copy from '@spectrum-icons/workflow/Copy';
import Preview from '@spectrum-icons/workflow/Preview';
import ChevronLeft from '@spectrum-icons/workflow/ChevronLeft';
import NotFound from '@spectrum-icons/illustrations/NotFound';
import { copyTable, enrichWithVariants } from './copy-utils';

function renderEmptyState() {
  return (
    <IllustratedMessage>
      <NotFound />
      <Heading>No results</Heading>
      <Content>No results found</Content>
    </IllustratedMessage>
  );
}

function openPreview(block) {
  window.open(block.path, '_blockpreview');
}

function handleBlockAction(action, block) {
  switch (action) {
    case "preview":
      openPreview(block);
      break;
    case "copy":
      copyTable(block?.variants?.[0]);
      break;
  }
}

export default function Picker() {
  const [loading, setLoading] = useState(true);
  const [blocks, setBlocks] = useState(null);
  const [openedSubmenu, setOpenedSubmenu] = useState(null);

  useEffect(() => {
    fetch('/block-library/query-index.json')
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        return Promise.allSettled(json.data.map(async (block) => {
          await enrichWithVariants(block)
          return block
        }))
      }).then((blocks) => {
        const fulfilledBlocks = [...blocks]
          .filter((promise) => promise.status === 'fulfilled')
          .map((promise) => promise.value)
        setBlocks(fulfilledBlocks);
        setLoading(false);
      })
  }, []);

  if (loading) {
    return <Flex justifyContent={"center"} height={"100%"}><ProgressCircle isIndeterminate /></Flex>
  }

  if (openedSubmenu) {
    const block = blocks.find((block) => block.path === openedSubmenu);
    const variants = block.variants;

    return <>
      <ActionButton onPress={() => setOpenedSubmenu(null)} isQuiet><ChevronLeft /><Text>Back</Text></ActionButton>
      <ActionButton onPress={() => openPreview(block)} isQuiet><Preview /><Text>Preview</Text></ActionButton>
      <ListView maxWidth="size-6000" renderEmptyState={renderEmptyState}
      >
        {variants.map(variant => <Item key={variant.name}>
          <Text>{variant.name}</Text>
          <ActionButton onPress={() => copyTable(variant)}><Copy /></ActionButton>
        </Item>)}
      </ListView>
    </>
  }

  return <ListView
    maxWidth="size-6000"
    minHeight={(blocks && blocks.length > 0) ? undefined : 'size-3000'}
    renderEmptyState={renderEmptyState}
    onAction={(blockPath) => setOpenedSubmenu(blockPath)}
  >
    {
      blocks?.map((block) => {
        return <Item key={block.path} hasChildItems>
          <Text>{block.title}</Text>
          <ActionMenu direction={"left"} onAction={(key) => handleBlockAction(key, block)}>
            <Item key={"preview"}>
              <Preview />
              <Text>Preview</Text>
            </Item>
            <Item key={"copy"}>
              <Copy />
              <Text>Copy Default Variant</Text>
            </Item>
          </ActionMenu>
        </Item>
      })
    }
  </ListView>
}
