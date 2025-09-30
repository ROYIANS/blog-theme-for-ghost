import "@once-ui-system/core/css/styles.css";
import "@once-ui-system/core/css/tokens.css";
import "@/resources/custom.css";

import classNames from "classnames";
import { Metadata } from "next";

import { Background, Column, Flex } from "@once-ui-system/core";
import { Footer, Header, Providers } from "@/components";
import { effects, fonts, style, dataStyle } from "@/resources/once-ui.config";
import { siteConfig } from "@/resources/config";

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Flex
      suppressHydrationWarning
      as="html"
      lang="zh-CN"
      fillWidth
      className={classNames(
        fonts.heading.variable,
        fonts.body.variable,
        fonts.label.variable,
        fonts.code.variable,
      )}
    >
      <head>
        <script
          id="theme-init"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const root = document.documentElement;
                  const defaultTheme = 'system';

                  // Set defaults from config
                  const config = ${JSON.stringify({
                    brand: style.brand,
                    accent: style.accent,
                    neutral: style.neutral,
                    solid: style.solid,
                    "solid-style": style.solidStyle,
                    border: style.border,
                    surface: style.surface,
                    transition: style.transition,
                    scaling: style.scaling,
                    "viz-style": dataStyle.variant,
                  })};

                  // Apply default values
                  Object.entries(config).forEach(([key, value]) => {
                    root.setAttribute('data-' + key, value);
                  });

                  // Resolve theme
                  const resolveTheme = (themeValue) => {
                    if (!themeValue || themeValue === 'system') {
                      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                    }
                    return themeValue;
                  };

                  // Apply saved theme
                  const savedTheme = localStorage.getItem('data-theme');
                  const resolvedTheme = resolveTheme(savedTheme);
                  root.setAttribute('data-theme', resolvedTheme);

                  // Apply any saved style overrides
                  const styleKeys = Object.keys(config);
                  styleKeys.forEach(key => {
                    const value = localStorage.getItem('data-' + key);
                    if (value) {
                      root.setAttribute('data-' + key, value);
                    }
                  });
                } catch (e) {
                  console.error('Failed to initialize theme:', e);
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              })();
            `,
          }}
        />
      </head>
      <Flex fillWidth direction="column" as="body">
        <Background
          style={{ zIndex: 0, position: "fixed" }}
          position="absolute"
          height="200"
          gradient={effects.gradient}
          dots={effects.dots}
          lines={effects.lines}
          mask={effects.mask}
          grid={effects.grid}
          onBackgroundGradientStyleChange={() => {}}
          onBackgroundDotsStyleChange={() => {}}
          onBackgroundLinesStyleChange={() => {}}
        />
        <Providers>
          <Flex fillWidth minHeight="100vh" direction="column">
            <Header />
            <Flex as="main" direction="column" fillWidth flex={1} paddingY="l">
              <Column maxWidth="m" fillWidth>
                {children}
              </Column>
            </Flex>
            <Footer />
          </Flex>
        </Providers>
      </Flex>
    </Flex>
  );
}