/* eslint no-unused-vars: 0 */
import React from 'react';

import { BootstrapTableful } from 'react-bootstrap-table2';
import Code from 'components/common/code-block';
import { productsGenerator } from 'utils/common';

const products = productsGenerator();

const columns = [{
  dataField: 'id',
  text: 'Product ID',
  style: {
    fontWeight: 'bold',
    fontSize: '18px'
  }
}, {
  dataField: 'name',
  text: 'Product Name',
  style: (cell, row, colIndex) => {
    if (row.id % 2 === 0) {
      return {
        backgroundColor: '#81c784'
      };
    }
    return {
      backgroundColor: '#c8e6c9'
    };
  }
}, {
  dataField: 'price',
  text: 'Product Price'
}];

const sourceCode = `\
const columns = [{
  dataField: 'id',
  text: 'Product ID',
  style: {
    fontWeight: 'bold',
    fontSize: '18px'
  }
}, {
  dataField: 'name',
  text: 'Product Name',
  style: (cell, row, colIndex) => {
    if (row.id % 2 === 0) {
      return {
        backgroundColor: '#81c784'
      };
    }
    return {
      backgroundColor: '#c8e6c9'
    };
  }
}, {
  dataField: 'price',
  text: 'Product Price'
}];

<BootstrapTableful keyField='id' data={ products } columns={ columns } />
`;

export default () => (
  <div>
    <BootstrapTableful keyField="id" data={ products } columns={ columns } />
    <Code>{ sourceCode }</Code>
  </div>
);
