import type { Meta, StoryObj } from '@storybook/react';
import {
  Typography,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  BodyText,
  SmallText,
  Caption,
  Body,
  TypographyLink,
} from './Typography';
import { Card, Space, Divider } from 'antd';

const meta: Meta<typeof Typography> = {
  title: 'Components/Typography',
  component: Typography,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Typography>;

export const Headings: Story = {
  render: () => (
    <Card title="Heading Styles">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <H1>Heading 1 - Main Title</H1>
        <H2>Heading 2 - Section Title</H2>
        <H3>Heading 3 - Subsection Title</H3>
        <H4>Heading 4 - Minor Section</H4>
        <H5>Heading 5 - Small Heading</H5>
        <H6>Heading 6 - Smallest Heading</H6>
      </Space>
    </Card>
  ),
};

export const BodyTexts: Story = {
  render: () => (
    <Card title="Body Text Styles">
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Body>
          This is a paragraph of body text. It demonstrates the standard body text style used
          throughout the application. Body text should be readable and comfortable for extended
          reading.
        </Body>
        <BodyText>This is regular body text without paragraph spacing.</BodyText>
        <SmallText>This is small text for secondary information.</SmallText>
        <Caption>This is caption text for labels and metadata.</Caption>
      </Space>
    </Card>
  ),
};

export const TextVariants: Story = {
  render: () => (
    <Card title="Text Variants">
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <BodyText>Default text</BodyText>
        <BodyText type="secondary">Secondary text</BodyText>
        <BodyText type="success">Success text</BodyText>
        <BodyText type="warning">Warning text</BodyText>
        <BodyText type="danger">Danger text</BodyText>
        <BodyText strong>Strong/Bold text</BodyText>
        <BodyText italic>Italic text</BodyText>
        <BodyText underline>Underlined text</BodyText>
        <BodyText delete>Deleted/Strikethrough text</BodyText>
        <BodyText code>Code text</BodyText>
        <BodyText mark>Marked/Highlighted text</BodyText>
        <BodyText keyboard>Keyboard shortcut text</BodyText>
      </Space>
    </Card>
  ),
};

export const Links: Story = {
  render: () => (
    <Card title="Link Styles">
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <TypographyLink href="#" target="_blank">
          Default Link
        </TypographyLink>
        <TypographyLink href="#">Standard Link</TypographyLink>
        <TypographyLink href="#" target="_blank">
          External Link (opens in new tab)
        </TypographyLink>
      </Space>
    </Card>
  ),
};

export const ParagraphVariants: Story = {
  render: () => (
    <Card title="Paragraph Variants">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Body>Default paragraph text.</Body>
        <Body type="secondary">Secondary paragraph text.</Body>
        <Body strong>Strong paragraph text.</Body>
        <Body italic>Italic paragraph text.</Body>
        <Body underline>Underlined paragraph text.</Body>
        <Body
          ellipsis={{
            rows: 2,
            expandable: true,
          }}
        >
          This is a long paragraph that will be truncated with ellipsis. It demonstrates the
          ellipsis functionality with expandable option. You can click to expand and see more
          content. This is useful for displaying previews of longer text content.
        </Body>
      </Space>
    </Card>
  ),
};

export const TypographyScale: Story = {
  render: () => (
    <Card title="Typography Scale">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <H1>Typography Scale</H1>
          <Body type="secondary">This demonstrates the complete typography hierarchy</Body>
        </div>
        <Divider />
        <div>
          <H2>Section Title</H2>
          <Body>
            This is body text that follows a section title. It provides context and details about
            the section.
          </Body>
        </div>
        <div>
          <H3>Subsection</H3>
          <Body>
            This is body text for a subsection. It contains more specific information related to the
            subsection topic.
          </Body>
        </div>
        <div>
          <H4>Minor Section</H4>
          <Body>
            This is body text for a minor section. It provides additional details or supporting
            information.
          </Body>
        </div>
        <Divider />
        <div>
          <BodyText strong>Important Note:</BodyText>
          <Body>
            This is a note with important information. The body text follows the strong label.
          </Body>
        </div>
        <div>
          <Caption>Last updated: November 2024</Caption>
        </div>
      </Space>
    </Card>
  ),
};

export const RealWorldExample: Story = {
  render: () => (
    <Card title="Article Example">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <H1>Understanding Design Systems</H1>
        <Body type="secondary">Published on November 19, 2024 • 5 min read</Body>
        <Divider />
        <H2>Introduction</H2>
        <Body>
          Design systems are collections of reusable components, guided by clear standards, that can
          be assembled together to build any number of applications. They help teams build
          consistent, high-quality user interfaces more efficiently.
        </Body>
        <H3>Key Benefits</H3>
        <Body>Design systems provide several key benefits:</Body>
        <Body>
          <strong>Consistency:</strong> Ensures a cohesive look and feel across all products and
          platforms.
        </Body>
        <Body>
          <strong>Efficiency:</strong> Reduces development time by reusing components and patterns.
        </Body>
        <Body>
          <strong>Scalability:</strong> Makes it easier to maintain and update designs as products
          grow.
        </Body>
        <H3>Best Practices</H3>
        <Body>When building a design system, consider these best practices:</Body>
        <Body>
          Start with your most common components and patterns. Document everything clearly. Ensure
          accessibility from the start. Keep it flexible and adaptable.
        </Body>
        <Divider />
        <Body>
          <TypographyLink href="#">Read more about design systems</TypographyLink>
        </Body>
        <Caption>Tags: Design, Development, UI/UX</Caption>
      </Space>
    </Card>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <Card title="All Typography Variants">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <H1>H1 Heading</H1>
          <H2>H2 Heading</H2>
          <H3>H3 Heading</H3>
          <H4>H4 Heading</H4>
          <H5>H5 Heading</H5>
          <H6>H6 Heading</H6>
        </div>
        <Divider />
        <div>
          <Body>Body paragraph text</Body>
          <BodyText>Body text</BodyText>
          <SmallText>Small text</SmallText>
          <Caption>Caption text</Caption>
        </div>
        <Divider />
        <div>
          <BodyText strong>Strong text</BodyText>
          <BodyText italic>Italic text</BodyText>
          <BodyText code>Code text</BodyText>
          <BodyText mark>Marked text</BodyText>
        </div>
        <Divider />
        <div>
          <TypographyLink href="#">Link text</TypographyLink>
        </div>
      </Space>
    </Card>
  ),
};
