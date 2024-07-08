import React, { useEffect, useState } from 'react';
import { Visibility } from 'semantic-ui-react';
import DataTable from 'react-data-table-component';

function writeStyles(styleName, cssText) {
  if (!document.getElementById('styles-div')) return;

  var styleElement = document.getElementById(styleName);
  if (styleElement)
    document.getElementById('styles-div').removeChild(styleElement);
  styleElement = document.createElement('style');
  styleElement.type = 'text/css';
  styleElement.id = styleName;
  styleElement.innerHTML = cssText;
  document.getElementById('styles-div').appendChild(styleElement);
}

function TableWrapper(props) {
  // let {columns, data } = props;
  const customStyles = {
    headRow: {
      style: {
        backgroundColor: '#D4D4D4 !important', 
        borderRadius:'5px',
        color:'#000000DE',
        fontWeight:'600px', 
        lineHeight:'16px'
        
      },
    },
    rows: {
      style: {
    color: '#000000', 
    fontWeight:'400px', 
    lineHeight:'16px',
    fontSize:'14px'
      },
    },
  };
  let handleUpdate = (e, data) => {
  
    let rootElementHeight = window.innerHeight - 232;
    setCurrentDivHeight(rootElementHeight);
  };

  let [currentDivHeight, setCurrentDivHeight] = useState();

  useEffect(() => {
    var cssText =
      '#tableParent > div:first-child { height : ' + currentDivHeight + 'px; }';
    writeStyles('styles_js', cssText);
  }, [currentDivHeight]);

  useEffect(() => {
    let rootElementHeight = window.innerHeight - 232;
    setCurrentDivHeight(rootElementHeight);
  }, []);

  return (
    <Visibility
      onUpdate={handleUpdate}
      id="tableParent"
      style={{ background: '#f1f5f9', flex: 1 }}>
      <DataTable
        direction="auto"
        fixedHeader
        fixedHeaderScrollHeight={currentDivHeight + 'px'}
        highlightOnHover
        noContextMenu
        pagination
        pointerOnHover
        responsive
        subHeaderAlign="right"
        subHeaderWrap
        // selectableRows
        selectableRowsHighlight
        customStyles={customStyles}
        {...props}
      />
    </Visibility>
  );
}

export default TableWrapper;
