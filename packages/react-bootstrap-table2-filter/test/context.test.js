import 'jsdom-global/register';
import React from 'react';
import { shallow } from 'enzyme';
import _ from 'react-bootstrap-table-next/src/utils';
import BootstrapTable from 'react-bootstrap-table-next/src/bootstrap-table';

import {
  FILTER_TYPE
} from '../src/const';
import createFilterContext from '../src/context';
import { textFilter } from '../index';

describe('FilterContext', () => {
  let wrapper;
  // let filter;
  let FilterContext;

  const data = [{
    id: 1,
    name: 'A'
  }, {
    id: 2,
    name: 'B'
  }];

  const columns = [{
    dataField: 'id',
    text: 'ID',
    filter: textFilter()
  }, {
    dataField: 'name',
    text: 'Name',
    filter: textFilter()
  }];

  // const defaultFilter = {};

  const mockBase = jest.fn((props => (
    <BootstrapTable
      keyField="id"
      data={ data }
      columns={ columns }
      { ...props }
    />
  )));

  const handleFilterChange = jest.fn();

  function shallowContext(
    // customFilter = defaultFilter,
    enableRemote = false
  ) {
    mockBase.mockReset();
    handleFilterChange.mockReset();
    FilterContext = createFilterContext(
      _,
      jest.fn().mockReturnValue(enableRemote),
      handleFilterChange
    );

    return (
      <FilterContext.Provider
        columns={ columns }
        data={ data }
      >
        <FilterContext.Consumer>
          {
            filterProps => mockBase(filterProps)
          }
        </FilterContext.Consumer>
      </FilterContext.Provider>
    );
  }

  describe('default render', () => {
    beforeEach(() => {
      wrapper = shallow(shallowContext());
      wrapper.render();
    });

    it('should have correct Provider property after calling createFilterContext', () => {
      expect(FilterContext.Provider).toBeDefined();
    });

    it('should have correct Consumer property after calling createFilterContext', () => {
      expect(FilterContext.Consumer).toBeDefined();
    });

    it('should have correct currFilters', () => {
      expect(wrapper.instance().currFilters).toEqual({});
    });

    it('should pass correct cell editing props to children element', () => {
      expect(wrapper.length).toBe(1);
      expect(mockBase).toHaveBeenCalledWith({
        data,
        onFilter: wrapper.instance().onFilter
      });
    });
  });

  describe('when remote filter is enable', () => {
    beforeEach(() => {
      wrapper = shallow(shallowContext(true));
      wrapper.render();
      wrapper.instance().currFilters = { price: { filterVal: 20, filterType: FILTER_TYPE.TEXT } };
    });

    it('should pass original data without internal filtering', () => {
      expect(wrapper.length).toBe(1);
      expect(mockBase).toHaveBeenCalledWith({
        data,
        onFilter: wrapper.instance().onFilter
      });
    });
  });

  describe('onFilter', () => {
    let instance;
    describe('when filterVal is empty or undefined', () => {
      const filterVals = ['', undefined, []];

      beforeEach(() => {
        wrapper = shallow(shallowContext());
        wrapper.render();
        instance = wrapper.instance();
      });

      it('should correct currFilters', () => {
        filterVals.forEach((filterVal) => {
          instance.onFilter(columns[1], FILTER_TYPE.TEXT)(filterVal);
          expect(Object.keys(instance.currFilters)).toHaveLength(0);
        });
      });
    });

    describe('when filterVal is existing', () => {
      const filterVal = '3';

      beforeEach(() => {
        wrapper = shallow(shallowContext());
        wrapper.render();
        instance = wrapper.instance();
      });

      it('should correct currFilters', () => {
        instance.onFilter(columns[1], FILTER_TYPE.TEXT)(filterVal);
        expect(Object.keys(instance.currFilters)).toHaveLength(1);
      });
    });

    describe('when remote filter is enabled', () => {
      const filterVal = '3';

      beforeEach(() => {
        wrapper = shallow(shallowContext(true));
        wrapper.render();
        instance = wrapper.instance();
        instance.onFilter(columns[1], FILTER_TYPE.TEXT)(filterVal);
      });

      it('should correct currFilters', () => {
        expect(Object.keys(instance.currFilters)).toHaveLength(1);
      });

      it('should calling handleFilterChange correctly', () => {
        expect(handleFilterChange).toHaveBeenCalledTimes(1);
        expect(handleFilterChange).toHaveBeenCalledWith(instance.currFilters);
      });
    });

    describe('combination', () => {
      beforeEach(() => {
        wrapper = shallow(shallowContext());
        wrapper.render();
        instance = wrapper.instance();
      });

      it('should set correct currFilters', () => {
        instance.onFilter(columns[0], FILTER_TYPE.TEXT)('3');
        expect(Object.keys(instance.currFilters)).toHaveLength(1);

        instance.onFilter(columns[0], FILTER_TYPE.TEXT)('2');
        expect(Object.keys(instance.currFilters)).toHaveLength(1);

        instance.onFilter(columns[1], FILTER_TYPE.TEXT)('2');
        expect(Object.keys(instance.currFilters)).toHaveLength(2);

        instance.onFilter(columns[1], FILTER_TYPE.TEXT)('');
        expect(Object.keys(instance.currFilters)).toHaveLength(1);

        instance.onFilter(columns[0], FILTER_TYPE.TEXT)('');
        expect(Object.keys(instance.currFilters)).toHaveLength(0);
      });
    });
  });
});
