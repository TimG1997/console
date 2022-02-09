import {
  ContainerDetailsPageProps,
  ContainersDetailsPage,
  ContainersDetailsPage_,
} from '../../public/components/container';
import { mount, ReactWrapper, shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import store from '@console/internal/redux';
import { Provider } from 'react-redux';
import { Firehose, HorizontalNav, PageHeading } from '@console/internal/components/utils';
import { testPodInstance } from '../../__mocks__/k8sResourcesMocks';
import { Status } from '@console/shared';

describe(ContainersDetailsPage.displayName, () => {
  let wrapper: ReactWrapper;

  beforeEach(() => {
    const match = {
      params: { podName: 'test-name', ns: 'default' },
      isExact: true,
      path: '',
      url: '',
    };

    wrapper = mount(<ContainersDetailsPage match={match} />, {
      wrappingComponent: ({ children }) => <Provider store={store}>{children}</Provider>,
    });
  });

  it('renders a `Firehose` using the given props', () => {
    const firehoseResources = wrapper.find<any>(Firehose).props().resources[0];
    expect(firehoseResources).toEqual({
      name: 'test-name',
      namespace: 'default',
      kind: 'Pod',
      isList: false,
      prop: 'obj',
    });
  });
});

describe(ContainersDetailsPage.displayName, () => {
  let containerDetailsPageWrapper: ShallowWrapper<ContainerDetailsPageProps>;

  const match = {
    params: { podName: 'test-name', ns: 'default', name: 'crash-app' },
    isExact: true,
    path: '',
    url: '',
  };
  const obj = { data: { ...testPodInstance } };
  const waitingState = 'Waiting';

  beforeEach(() => {
    containerDetailsPageWrapper = shallow(<ContainersDetailsPage_ match={match} obj={obj} />);
  });

  it('renders a `PageHeading` and a `ContainerDetails` with the same state', () => {
    const pageHeadingProps = containerDetailsPageWrapper.find<any>(PageHeading).props();
    const containerDetails = shallow(
      containerDetailsPageWrapper
        .find<any>(HorizontalNav)
        .props()
        .pages[0].component({ match, obj: testPodInstance }),
    );
    const containerDetailsStatusProps = containerDetails.find<any>(Status).props();

    expect(pageHeadingProps.getResourceStatus()).toEqual(waitingState);
    expect(containerDetailsStatusProps.status).toEqual(waitingState);
  });
});
