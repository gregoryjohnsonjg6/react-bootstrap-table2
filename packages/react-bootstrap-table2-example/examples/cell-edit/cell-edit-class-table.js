/* eslint no-unused-vars: 0 */
import React from 'react';

import BootstrapTable from 'react-bootstrap-table2';
import Code from 'components/common/code-block';
import { productsGenerator } from 'utils/common';

const products = productsGenerator();

const columns = [{
  dataField: 'id',
  text: 'Product ID'
}, {
  dataField: 'name',
  text: 'Product Name',
  editCellClasses: 'editing-name'
}, {
  dataField: 'price',
  text: 'Product Price',
  editCellClasses: (cell, row, rowIndex, colIndex) =>
    (cell > 2101 ? 'editing-price-bigger-than-2101' : 'editing-price-small-than-2101')
}];

const sourceCode = `\
const columns = [{
  dataField: 'id',
  text: 'Product ID'
}, {
  dataField: 'name',
  text: 'Product Name',
  editCellClasses: 'editing-name'
}, {
  dataField: 'price',
  text: 'Product Price',
  editCellClasses: (cell, row, rowIndex, colIndex) =>
    (cell > 2101 ? 'editing-price-bigger-than-2101' : 'editing-price-small-than-2101')
}];

const cellEdit = {
  mode: 'click'
};

<BootstrapTable
  keyField='id'
  data={ products }
  columns={ columns }
  cellEdit={ cellEdit }
/>
`;

const cellEdit = {
  mode: 'click'
};
export default () => (
  <div>
    <BootstrapTable keyField="id" data={ products } columns={ columns } cellEdit={ cellEdit } />
    <Code>{ sourceCode }</Code>
  </div>
);
