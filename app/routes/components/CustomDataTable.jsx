import React from 'react';
import { Page, LegacyCard, DataTable, Card, Button } from '@shopify/polaris';

export const CustomDataTable = () => {
  const rows = [
    ['Enterprise Plan', '$150', 'Unlimited', 'Unlimited', <Button size="large" variant="primary" tone="success">Subscribe</Button>],
    ['Platinum Plan', '$50', '10000	', 'Unlimited', <Button size="large" variant="primary" tone="success">Subscribe</Button>],
    ['Enterprise Plan', '$150', 'Unlimited', 'Unlimited', <Button size="large" variant="primary" tone="success">Subscribe</Button>],
  ];

  return (

    <div style={{ marginTop: '25px' }}>
    <Card>
      <Page title="Products Feed">
        <LegacyCard>
          <DataTable
            columnContentTypes={['text', 'numeric', 'numeric', 'numeric', 'numeric']}
            headings={['Plan', 'Price', 'Max Product', 'No. of feeds', 'Subscribe']}
            rows={rows}
          />
        </LegacyCard>
      </Page>
    </Card>
    </div>
  );
}

