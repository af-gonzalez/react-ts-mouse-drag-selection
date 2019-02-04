import React, { Component } from 'react';
import { Segment } from 'semantic-ui-react';
import { DragContainer, DragPanel, DragElement } from './components/DragSelection';

import './App.css';
import 'semantic-ui-css/semantic.min.css';

const elements: string[] = [];

for (let i = 1; i < 35; i++) {
  elements.push(`Element ${i}`);
}

class App extends Component {
  elements = elements;

  render() {
    return (
      <div className="app">
        <div>
          <h1>Selection Panel</h1>
          <h3>Press Shift key to chain selections</h3>
          <DragContainer>
            <Segment className="panel-container">
              <DragPanel>
                {this.elements.map((element, index) => (
                  <div className="item-container" key={index}>
                    <DragElement elementId={element} className="selectable-item">
                      {element}
                    </DragElement>
                  </div>
                ))}
              </DragPanel>
            </Segment>
          </DragContainer>
        </div>
      </div>
    );
  }
}

export default App;
