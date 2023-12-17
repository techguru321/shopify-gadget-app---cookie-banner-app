import { Icon, HorizontalStack, Text } from '@shopify/polaris';
import { FavoriteMajor } from '@shopify/polaris-icons';

const Feature = ({ content }) => {
  return (
    <HorizontalStack align="center" blockAlign="center" gap="1">
      <Icon color="primary" source={FavoriteMajor} />
      <Text as="p" variant="bodyMd">
        {content}
      </Text>
    </HorizontalStack>
  )
};

export default Feature;
