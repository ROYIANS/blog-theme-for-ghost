import { Column, Heading, Text } from "@once-ui-system/core";
import { siteConfig } from "@/resources/config";

export default function AboutPage() {
  return (
    <Column fillWidth gap="l" paddingY="xl">
      <Column gap="m">
        <Heading as="h1" variant="display-strong-l">
          关于
        </Heading>
        <Text variant="body-default-l" onBackground="neutral-weak">
          {siteConfig.description}
        </Text>
      </Column>

      <Column gap="m">
        <Heading as="h2" variant="heading-strong-m">
          关于作者
        </Heading>
        <Text variant="body-default-m">
          {siteConfig.author.bio}
        </Text>
      </Column>
    </Column>
  );
}