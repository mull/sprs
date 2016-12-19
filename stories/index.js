import React from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook';
import SexprEditor from './SexprEditor';


storiesOf('Builder', module)
  .add('blabla', () => (
    <SexprEditor showApp={linkTo('Button')}/>
  ));

