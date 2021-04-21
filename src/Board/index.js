import React from 'react';
import Square from './Square';

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => {
                    this.props.onClick(i);
                }}
            />
        );
    }

    renderGrid() {
        const grid = [];
        let row = [];
        let i = 0;
        for (let r = 0; r < 3; r++) {
            for (let s = 0; s < 3; s++) {
                row.push(this.renderSquare(i));
                i++;
            }
            grid.push(<div className="board-row">{row}</div>);
            row = [];
        }
        return grid;
    }

    render() {
        return <div>{this.renderGrid()}</div>;
    }
}

export default Board;
