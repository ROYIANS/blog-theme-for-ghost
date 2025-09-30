import { Column, Heading, Text, Button } from "@once-ui-system/core";
import { siteConfig } from "@/resources/config";

export default function HomePage() {
  return (
    <Column fillWidth gap="l" paddingY="xl" center>
      <Column gap="m" center textAlign="center">
        <Heading as="h1" variant="display-strong-xl">
          {siteConfig.name}
        </Heading>
        <Text variant="body-default-l" onBackground="neutral-weak">
          {siteConfig.description}
        </Text>
      </Column>

      <Column gap="s" center>
        <Text variant="body-default-m">
          🚀 项目架构已搭建完成
        </Text>
        <Text variant="body-default-s" onBackground="neutral-weak">
          下一步：配置 Halo API 并开始开发功能
        </Text>
      </Column>

      <Button
        variant="primary"
        size="l"
        href="/about"
      >
        了解更多
      </Button>
    </Column>
  );
}