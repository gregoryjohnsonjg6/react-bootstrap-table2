import 'jsdom-global/register';
import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import Const from '../../src/const';
import Store from '../../src/store';
import BootstrapTable from '../../src/bootstrap-table';
import wrapperFactory from '../../src/sort/wrapper';

describe('SortWrapper', () => {
  let wrapper;

  const columns = [{
    dataField: 'id',
    text: 'ID',
    sort: true
  }, {
    dataField: 'name',
    text: 'Name',
    sort: true
  }];

  const data = [{
    id: 1,
    name: 'A'
  }, {
    id: 2,
    name: 'B'
  }];

  const keyField = 'id';

  let store = new Store(keyField);
  store.data = data;

  const SortWrapper = wrapperFactory(BootstrapTable);

  beforeEach(() => {
    wrapper = shallow(
      <SortWrapper
        keyField={ keyField }
        data={ data }
        columns={ columns }
        store={ store }
      />
    );
  });

  it('should render SortWrapper correctly', () => {
    expect(wrapper.length).toBe(1);
    expect(wrapper.find(BootstrapTable)).toBeDefined();
  });

  it('should inject correct props to base component', () => {
    expect(wrapper.props().onSort).toBeDefined();
  });

  describe('call handleSort function', () => {
    let sortBySpy;
    const sortColumn = columns[0];

    beforeEach(() => {
      store = new Store(keyField);
      store.data = data;
      sortBySpy = sinon.spy(store, 'sortBy');
    });

    describe('when remote.sort is false', () => {
      beforeEach(() => {
        wrapper = shallow(
          <SortWrapper
            keyField={ keyField }
            data={ data }
            columns={ columns }
            store={ store }
          />
        );

        wrapper.instance().handleSort(sortColumn);
      });

      it('should operating on store correctly', () => {
        expect(store.sortOrder).toEqual(Const.SORT_DESC);
        expect(store.sortField).toEqual(sortColumn.dataField);

        wrapper.instance().handleSort(sortColumn); // sort same column again
        expect(store.sortOrder).toEqual(Const.SORT_ASC);
        expect(store.sortField).toEqual(sortColumn.dataField);
      });

      it('should calling store.sortBy correctly', () => {
        expect(sortBySpy.calledOnce).toBeTruthy();
        expect(sortBySpy.calledWith(sortColumn)).toBeTruthy();
      });
    });

    describe('when remote.sort is true', () => {
      let onTableChangeCB;

      beforeEach(() => {
        onTableChangeCB = sinon.stub();
        wrapper = shallow(
          <SortWrapper
            remote
            keyField={ keyField }
            data={ data }
            columns={ columns }
            store={ store }
            onTableChange={ onTableChangeCB }
          />
        );
        wrapper.instance().handleSort(sortColumn);
      });

      it('should operating on store correctly', () => {
        expect(store.sortOrder).toEqual(Const.SORT_DESC);
        expect(store.sortField).toEqual(sortColumn.dataField);

        wrapper.instance().handleSort(sortColumn); // sort same column again
        expect(store.sortOrder).toEqual(Const.SORT_ASC);
        expect(store.sortField).toEqual(sortColumn.dataField);
      });

      it('should not calling store.sortBy', () => {
        expect(sortBySpy.calledOnce).toBeFalsy();
      });

      it('should calling props.onTableChange', () => {
        expect(onTableChangeCB.calledOnce).toBeTruthy();
      });
    });
  });

  describe('when defaultSorted prop is defined', () => {
    const defaultSorted = [{
      dataField: 'name',
      order: Const.SORT_DESC
    }];

    beforeEach(() => {
      wrapper = shallow(
        <SortWrapper
          keyField={ keyField }
          data={ data }
          columns={ columns }
          store={ store }
          defaultSorted={ defaultSorted }
        />
      );
    });

    it('should render table with correct default sorted', () => {
      expect(wrapper.props().data).toEqual(store.data);
    });

    it('should update store.sortField correctly', () => {
      expect(store.sortField).toEqual(defaultSorted[0].dataField);
    });

    it('should update store.sortOrder correctly', () => {
      expect(store.sortOrder).toEqual(defaultSorted[0].order);
    });
  });

  describe('componentWillReceiveProps', () => {
    let nextProps;

    beforeEach(() => {
      nextProps = { columns, store };
      store.sortField = columns[1].dataField;
      store.sortOrder = Const.SORT_DESC;
    });

    describe('if nextProps.isDataChanged is true', () => {
      beforeEach(() => {
        nextProps.isDataChanged = true;
        store.sortBy = sinon.stub();
      });

      it('should sorting again', () => {
        wrapper.instance().componentWillReceiveProps(nextProps);
        expect(store.sortBy.calledOnce).toBeTruthy();
      });
    });

    describe('if nextProps.isDataChanged is false', () => {
      beforeEach(() => {
        nextProps.isDataChanged = false;
        store.sortBy = sinon.stub();
      });

      it('should not sorting', () => {
        wrapper.instance().componentWillReceiveProps(nextProps);
        expect(store.sortBy.calledOnce).toBeFalsy();
      });
    });
  });
});
