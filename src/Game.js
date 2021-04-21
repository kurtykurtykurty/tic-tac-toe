//  =====================================
//// 1. Отобразите позицию для каждого хода в формате (колонка, строка) в списке истории ходов.
//// 2. Выделите выбранный элемент в списке ходов.
//// 3. Перепишите Board, используя вложенные циклы для создания клеток, вместо их жёсткого кодирования.
//// 4. Добавьте переключатель, который позволит вам сортировать ходы по возрастанию или по убыванию.
// 5. Когда кто-то выигрывает, подсветите три клетки, которые привели к победе.
// 6. Когда победителя нет, покажите сообщение о том, что игра окончилась вничью.
//  =====================================

import React from 'react';
import Board from './Board';

class Game extends React.Component {
    state = {
        history: [
            {
                squares: Array(9).fill(null),
                lastStep: null,
                isFocused: false,
            },
        ],
        stepNumber: 0,
        xIsNext: true,
        currentStep: null,
        order: 0,
    };

    historyFind(i) {
        let c = 0;
        for (const obj in this.state.history) {
            if (i === this.state.history[obj].lastStep) {
                return c;
            }
            c++;
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice(); //  TODO not slice

        if (squares[i]) {
            const focus = this.historyFind(i);
            let newState = { ...this.state }; // ! TODO WHY
            newState.history[focus].isFocused = !newState.history[focus]
                .isFocused;
            this.setState({ ...newState });
            return;
        }

        if (calculateWinner(squares)) {
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([
                {
                    squares: squares,
                    lastStep: i,
                    isFocused: false,
                },
            ]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
            currentStep: i,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: step % 2 === 0,
        });
    }

    togleOrder() {
        const order = this.state.order ? 0 : 1;
        this.setState({ order: order });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber]; // return last elem of array
        const winner = calculateWinner(current.squares);
        const order = this.state.order;

        // FIX hack
        const table = [
            '1:1',
            '2:1',
            '3:1',
            '1:2',
            '2:2',
            '3:2',
            '1:3',
            '2:3',
            '3:3',
        ];

        // create array 'moves' of history buttons
        const moves = history.map((step, move) => {
            const desc = move
                ? 'Go to step ' + move + ' -> ' + table[history[move].lastStep]
                : 'Go to begin';
            return (
                <li key={move}>
                    <button
                        onClick={() => this.jumpTo(move)}
                        style={
                            history[move].isFocused
                                ? { borderColor: 'gold' }
                                : {}
                        }
                    >
                        {desc}
                    </button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = winner + ' is winner';
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        const historyList = order ? (
            <ol reversed>{moves.reverse()}</ol>
        ) : (
            <ol>{moves}</ol>
        );

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <TogleOrder
                        onClick={() => this.togleOrder()}
                        order={this.state.order}
                    />
                    {historyList}
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [6, 4, 2],
    ];

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (
            squares[a] &&
            squares[a] === squares[b] &&
            squares[a] === squares[c]
        ) {
            return squares[a];
        }
    }

    return null;
}

function TogleOrder(props) {
    return <button onClick={props.onClick}>{props.order ? '↑' : '↓'}</button>;
}
// ========================================

export default Game;
