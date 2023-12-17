import {
  Text, VerticalStack, HorizontalStack
} from '@shopify/polaris';

const intervalTranslation = {
  'EVERY_30_DAYS': 'month',
};

const Amount = ({ currency, amount }) => {
  return (
    <VerticalStack align="center">
      <HorizontalStack align="center" blockAlign="center" gap="1">
        <Text as="p" variant="bodySm">{currency}/</Text>
        <Text as="p" variant="bodyLg" fontWeight="bold">{amount}$</Text>
        <Text as="p" variant="bodySm">Monthly</Text>
      </HorizontalStack>
    </VerticalStack>
  )
};

export default Amount;
