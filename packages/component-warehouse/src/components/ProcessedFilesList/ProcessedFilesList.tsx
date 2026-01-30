import * as React from 'react';
import { List } from 'antd';
import { FileTextOutlined, LinkOutlined } from '@ant-design/icons';
import { Card } from '../Card';
import { Body } from '../Typography';

export interface ProcessedFilesListProps {
  /** Array of processed file names (strings or objects with file property) */
  files: (string | { file?: string; [key: string]: any })[];
  /** Title for the list card */
  title?: string;
  /** Show card wrapper around the list */
  showCard?: boolean;
  /** Empty state message */
  emptyMessage?: string;
  /** Custom className */
  className?: string;
  /** S3 bucket name for generating links */
  s3Bucket?: string;
  /** S3 prefix/folder path */
  s3Prefix?: string;
  /** Date folder in YYYYMMDD format */
  date?: string;
  /** Array of broker names to match with files */
  brokers?: string[];
  /** AWS region (default: us-east-1) */
  awsRegion?: string;
}

/**
 * ProcessedFilesList component displays a list of processed files using Ant Design's List component.
 * Handles both string arrays and object arrays with file properties.
 * Can generate S3 console links if bucket, prefix, date, and brokers are provided.
 */
export const ProcessedFilesList: React.FC<ProcessedFilesListProps> = ({
  files,
  title = 'Processed Files',
  showCard = true,
  emptyMessage = 'No files processed',
  className,
  s3Bucket,
  s3Prefix,
  date,
  brokers = [],
  awsRegion = 'us-east-1',
}) => {
  // Function to match a file to a broker
  const matchFileToBroker = (fileName: string): string | undefined => {
    if (!brokers || brokers.length === 0) return undefined;
    
    // Try to find broker name in filename (case-insensitive)
    const fileNameLower = fileName.toLowerCase();
    for (const broker of brokers) {
      if (fileNameLower.includes(broker.toLowerCase())) {
        return broker;
      }
    }
    
    // If no match found and only one broker, use it
    if (brokers.length === 1) {
      return brokers[0];
    }
    
    return undefined;
  };

  // Function to generate S3 console URL
  const generateS3Url = (fileName: string): string | null => {
    if (!s3Bucket || !s3Prefix || !date) return null;
    
    const broker = matchFileToBroker(fileName);
    if (!broker) return null;
    
    // Normalize prefix - remove trailing slash if present
    const normalizedPrefix = s3Prefix.endsWith('/') ? s3Prefix.slice(0, -1) : s3Prefix;
    
    // Construct the S3 path: prefix/date/broker/filename
    const s3Path = `${normalizedPrefix}/${date}/${broker}/${fileName}`;
    console.log(s3Path);
    // Generate AWS Console URL (prefix is not URI encoded)
    return `https://${awsRegion}.console.aws.amazon.com/s3/object/${s3Bucket}?region=${awsRegion}&prefix=${s3Path}`;
  };

  // Normalize file data - extract string from objects if needed
  const normalizedFiles = React.useMemo(() => {
    return files.map((file, idx) => {
      if (typeof file === 'string') {
        const s3Url = generateS3Url(file);
        return { id: idx, name: file, s3Url };
      }
      const fileValue = (file as any)?.file || JSON.stringify(file);
      const s3Url = generateS3Url(fileValue);
      return { id: idx, name: fileValue, s3Url };
    });
  }, [files, s3Bucket, s3Prefix, date, brokers, awsRegion]);

  const listContent = (
    <List
      dataSource={normalizedFiles}
      locale={{ emptyText: emptyMessage }}
      renderItem={(item) => (
        <List.Item>
          <List.Item.Meta
            avatar={<FileTextOutlined style={{ fontSize: 16, color: '#4E738A' }} />}
            title={
              item.s3Url ? (
                <a
                  href={item.s3Url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: 4,
                    color: 'inherit',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.textDecoration = 'underline';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.textDecoration = 'none';
                  }}
                >
                  <span>{item.name}</span>
                  <LinkOutlined style={{ fontSize: 12, marginLeft: 4 }} />
                </a>
              ) : (
                <Body>{item.name}</Body>
              )
            }
          />
        </List.Item>
      )}
      bordered={false}
      className={className}
    />
  );

  if (showCard) {
    return (
      <Card
        title={
          <span>
            <FileTextOutlined style={{ marginRight: 8 }} />
            {title}
          </span>
        }
      >
        {normalizedFiles.length > 0 ? (
          listContent
        ) : (
          <Body>{emptyMessage}</Body>
        )}
      </Card>
    );
  }

  return normalizedFiles.length > 0 ? listContent : <Body>{emptyMessage}</Body>;
};

ProcessedFilesList.displayName = 'ProcessedFilesList';

