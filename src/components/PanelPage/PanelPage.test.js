import { shallow } from 'enzyme';
import React from 'react';
import PanelPage from './PanelPage';

test('renders without failing', () => {
    let wrapper = shallow(<PanelPage />);

    expect(wrapper).toBeDefined();
});
