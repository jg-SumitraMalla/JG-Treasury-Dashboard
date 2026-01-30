import type { Meta, StoryObj } from '@storybook/react';
import { ProcessedFilesList } from './ProcessedFilesList';
import { Layout, LayoutItem } from '../Layout';

const meta: Meta<typeof ProcessedFilesList> = {
  title: 'Components/ProcessedFilesList',
  component: ProcessedFilesList,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    files: {
      control: 'object',
      description: 'Array of processed file names (strings or objects with file property)',
    },
    title: {
      control: 'text',
      description: 'Title for the list card',
    },
    showCard: {
      control: 'boolean',
      description: 'Show card wrapper around the list',
    },
    emptyMessage: {
      control: 'text',
      description: 'Empty state message',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ProcessedFilesList>;

const sampleFiles = [
  'bofa_file.csv',
  'gsco_file.csv',
  'jpm_file.csv',
  'ms_file.csv',
  'ubs_file.csv',
];

const sampleFilesWithObjects = [
  { file: 'bofa_file.csv', size: 1024 },
  { file: 'gsco_file.csv', size: 2048 },
  { file: 'jpm_file.csv', size: 1536 },
];

export const Default: Story = {
  args: {
    files: sampleFiles,
  },
};

export const WithManyFiles: Story = {
  args: {
    files: [
      ...sampleFiles,
      'file_6.csv',
      'file_7.csv',
      'file_8.csv',
      'file_9.csv',
      'file_10.csv',
      'file_11.csv',
      'file_12.csv',
    ],
  },
};

export const WithObjectFiles: Story = {
  args: {
    files: sampleFilesWithObjects,
  },
};

export const Empty: Story = {
  args: {
    files: [],
    emptyMessage: 'No files processed',
  },
};

export const CustomTitle: Story = {
  args: {
    files: sampleFiles,
    title: 'CSV Files Processed',
  },
};

export const WithoutCard: Story = {
  args: {
    files: sampleFiles,
    showCard: false,
  },
};

export const InLayout: Story = {
  render: () => (
    <Layout gap={16}>
      <LayoutItem span={6}>
        <ProcessedFilesList files={sampleFiles} />
      </LayoutItem>
      <LayoutItem span={6}>
        <ProcessedFilesList
          files={sampleFilesWithObjects}
          title="Object Files"
        />
      </LayoutItem>
    </Layout>
  ),
};

export const LongFileNames: Story = {
  args: {
    files: [
      'very_long_file_name_that_might_wrap_in_the_list_item.csv',
      'another_extremely_long_file_name_with_many_characters.csv',
      'short.csv',
      'medium_length_file_name.csv',
    ],
  },
};

export const WithS3Links: Story = {
  args: {
    files: [
      'jainftp_equityGenAvail_20250501.csv',
      'bofa_equityGenAvail_20250501.csv',
      'gsco_equityGenAvail_20250501.csv',
    ],
    s3Bucket: 'jg-data-treasit',
    s3Prefix: 'avail_files',
    date: '20250501',
    brokers: ['BARC', 'BOFA', 'GSCO'],
    title: 'Processed Files with S3 Links',
  },
};

