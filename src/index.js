import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import AddIcon from "@material-ui/icons/Add";
import Drawer from "@material-ui/core/Drawer";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import "./index.css";

import none from "./img/none.png";
import Z from "./img/Z.png";
import T from "./img/T.png";
import J from "./img/J.png";
import I from "./img/I.png";
import O from "./img/O.png";
import S from "./img/S.png";
import L from "./img/L.png";
import Z2 from "./img/Z2.png";
import T2 from "./img/T2.png";
import J2 from "./img/J2.png";
import I2 from "./img/I2.png";
import O2 from "./img/O2.png";
import S2 from "./img/S2.png";
import L2 from "./img/L2.png";
import Shade from "./img/Shade.png";

function AddButton(props) {
  return (
    <Button variant="contained" color="primary" onClick={props.onClick}>
      <div className="boxContainer">
        <AddIcon></AddIcon>
        新規作成
      </div>
    </Button>
  );
}

function Square(props) {
  useEffect(() => {
    props.images.forEach((elem, i) => {
      const canvas = document.getElementById(`${props.name}+${i}`);
      const ctx = canvas.getContext("2d");
      canvas.width = props.r;
      canvas.height = props.r;
      let img = new Image();
      img.src = elem.src;
      img.onload = function () {
        let YS = img.height / 3,
          XS = img.width / 3;
        ctx.drawImage(
          img,
          (elem.num % 3) * XS,
          Math.floor(elem.num / 3) * YS,
          XS,
          YS,
          0,
          0,
          props.r,
          props.r
        );
      };
    });
  });

  return (
    <button className="square" onClick={props.onClick}>
      <div className="pixel">
        {props.images.map((img, i) => (
          <canvas
            key={i}
            id={`${props.name}+${i}`}
            className="img"
            width={props.r}
            height={props.r}
          ></canvas>
        ))}
      </div>
    </button>
  );
}

class Canvas extends React.Component {
  renderSquare(i, j, imgs) {
    return (
      <Square
        key={i * this.props.sizeX + j}
        name={i * this.props.sizeX + j}
        images={imgs}
        onClick={() => this.props.onClick(i, j)}
        caption=""
        r={this.props.sizeOfSquare} // default
      />
    );
  }
  render() {
    const canvas = (
      <div>
        {this.props.data.map((row, i) => (
          <div key={i} className="canvas-row">
            {row.map((images, j) => this.renderSquare(i, j, images))}
          </div>
        ))}
      </div>
    );
    return canvas;
  }
}

class TabBar extends React.Component {
  render() {
    return <AddButton onClick={this.props.handleClickOfAddButton}></AddButton>;
  }
}

function Palette(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorEl2, setAnchorEl2] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  return (
    <div>
      <div>
        <Button
          aria-controls="palette-set"
          aria-haspopup="true"
          onClick={handleClick}
        >
          パレット: {props.colorSets[props.selectColorSetNumber].name}
        </Button>
        <Menu
          id="palette-set"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {props.colorSets.map((colorSet, i) => (
            <MenuItem
              key={i}
              onClick={() => {
                handleClose();
                props.setPalette(i);
              }}
            >
              {colorSet.name}
            </MenuItem>
          ))}
        </Menu>
      </div>
      <div>
        <Button
          aria-controls="palette"
          aria-haspopup="true"
          onClick={handleClick2}
        >
          カラー:
          {
            <img
              src={
                props.colorSets[props.selectColorSetNumber].body[
                  props.selectColorNumber
                ]
              }
              alt=""
              width={props.r}
              height={props.r}
            ></img>
          }
        </Button>
        <Menu
          id="palette"
          anchorEl={anchorEl2}
          keepMounted
          open={Boolean(anchorEl2)}
          onClose={handleClose2}
        >
          {props.colorSets[props.selectColorSetNumber].body.map((color, i) => (
            <MenuItem
              key={i}
              onClick={() => {
                handleClose2();
                props.setColor(i);
              }}
            >
              {<img src={color} alt="" width={props.r} height={props.r}></img>}
            </MenuItem>
          ))}
        </Menu>
      </div>
    </div>
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          canvas: createCanvas(16, 16, 0),
          processed: createCanvas2(16, 16, none, 4),
        },
      ],
      stepNumber: 0,
      sizeX: 16, // default
      sizeY: 16, // default
      colorSets: [
        {
          name: "default",
          body: [none, Z, T, J, I, O, S, L],
          side: [none, Z2, T2, J2, I2, O2, S2, L2],
          shade: [none, Shade, Shade, Shade, Shade, Shade, Shade, Shade],
        },
      ],
      selectColorSetNumber: 0,
      selectColorNumber: 1,
      sizeOfSquare: 36,
      showInitMenu: false,
      tf_n: "",
      tf_x: "",
      tf_y: "",
    };
  }
  ShowInitMenu() {
    return (
      <div>
        <TextField
          required
          id="fileName"
          label="ファイル名"
          value={this.state.tf_n}
          onChange={(event, value) => {
            this.setState({ tf_n: event.target.value });
          }}
        ></TextField>
        <TextField
          required
          id="sizeX"
          label="サイズX"
          value={this.state.tf_x}
          onChange={(event, value) => {
            this.setState({ tf_x: event.target.value });
          }}
        ></TextField>
        <TextField
          required
          id="sizeY"
          label="サイズY"
          value={this.state.tf_y}
          onChange={(event, value) => {
            this.setState({ tf_y: event.target.value });
          }}
        ></TextField>
        <Button
          onClick={() => {
            let X = isNaN(parseInt(this.state.tf_x))
                ? 16
                : parseInt(this.state.tf_x),
              Y = isNaN(parseInt(this.state.tf_y))
                ? 16
                : parseInt(this.state.tf_y);
            this.setState({
              showInitMenu: false,
              sizeX: X,
              sizeY: Y,
            });
            this.setState({
              history: [
                {
                  canvas: createCanvas(Y, X, 0),
                  processed: createCanvas2(Y, X, none, 4),
                },
              ],
              stepNumber: 0,
            });
          }}
        >
          作成
        </Button>
      </div>
    );
  }
  handleClickOfAddButton() {
    this.setState({ showInitMenu: true });
  }
  handleClickOfCanvas(i, j) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[this.state.stepNumber].canvas;
    current[i][j] = this.state.selectColorNumber;
    this.setState({
      history: history.concat([
        { canvas: current, processed: this.culcCanvas(current) },
      ]),
      stepNumber: history.length,
    });
  }
  setPalette(i) {
    this.setState({ selectColorSetNumber: i });
  }
  setColor(i) {
    this.setState({ selectColorNumber: i });
  }
  culcCanvas(canvas, r) {
    const processed = createCanvas3(this.state.sizeY, this.state.sizeX);
    let dy = [0, 1, 1, 1, 0, -1, -1, -1],
      dx = [1, 1, 0, -1, -1, -1, 0, 1];
    for (let y = 0; y < this.state.sizeY; y++) {
      for (let x = 0; x < this.state.sizeX; x++) {
        let res = [0, 0, 0, 0, 0, 0, 0, 0];
        for (let k = 0; k < 8; k++) {
          let ny = y + dy[k],
            nx = x + dx[k];
          if (
            !(
              0 <= ny &&
              ny < this.state.sizeY &&
              0 <= nx &&
              nx < this.state.sizeX
            )
          )
            continue;
          if (canvas[ny][nx] !== 0) res[k] = 1;
        }

        if (canvas[y][x] !== 0) {
          processed[y][x] = processed[y][x].concat([
            {
              src: this.state.colorSets[this.state.selectColorSetNumber].body[
                canvas[y][x]
              ],
              num: 5,
            },
          ]);
          continue;
        }

        if (res[4])
          processed[y][x] = processed[y][x].concat([
            {
              src: this.state.colorSets[this.state.selectColorSetNumber].shade[
                canvas[y + dy[4]][x + dx[4]]
              ],
              num: 2,
            },
          ]);
        if (res[5])
          processed[y][x] = processed[y][x].concat([
            {
              src: this.state.colorSets[this.state.selectColorSetNumber].shade[
                canvas[y + dy[5]][x + dx[5]]
              ],
              num: 8,
            },
          ]);
        if (res[6])
          processed[y][x] = processed[y][x].concat([
            {
              src: this.state.colorSets[this.state.selectColorSetNumber].shade[
                canvas[y + dy[6]][x + dx[6]]
              ],
              num: 6,
            },
          ]);

        if (res[2])
          processed[y][x] = processed[y][x].concat([
            {
              src: this.state.colorSets[this.state.selectColorSetNumber].side[
                canvas[y + dy[2]][x + dx[2]]
              ],
              num: 1,
            },
          ]);
      }
    }

    return processed;
  }

  render() {
    const history = this.state.history.slice();
    const current = history[this.state.stepNumber];
    return (
      <div>
        <Drawer
          anchor="top"
          open={this.state.showInitMenu}
          onClose={() => {
            this.setState({
              showInitMenu: false,
            });
          }}
        >
          {this.ShowInitMenu()}
        </Drawer>
        <TabBar
          handleClickOfAddButton={() => this.handleClickOfAddButton()}
        ></TabBar>
        <Palette
          colorSets={this.state.colorSets}
          selectColorSetNumber={this.state.selectColorSetNumber}
          selectColorNumber={this.state.selectColorNumber}
          setPalette={(i) => this.setPalette(i)}
          setColor={(i) => this.setColor(i)}
          r={this.props.sizeOfSquare}
        ></Palette>
        <div className="canvas">
          <Canvas
            className="layer"
            data={current.processed}
            onClick={(i, j) => this.handleClickOfCanvas(i, j)}
            sizeX={this.state.sizeX}
            sizeY={this.state.sizeY}
            sizeOfSquare={this.state.sizeOfSquare}
          ></Canvas>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.querySelector("#app"));

function createCanvas(Y, X, i) {
  var rows = new Array(Y);
  for (let y = 0; y < Y; y++) {
    rows[y] = new Array(X).fill(i);
  }
  return rows;
}

function createCanvas2(Y, X, src, num) {
  var rows = new Array(Y);
  for (let y = 0; y < Y; y++) {
    rows[y] = new Array(X).fill([{ src: src, num: num }]);
  }
  return rows;
}

function createCanvas3(Y, X) {
  var rows = new Array(Y);
  for (let y = 0; y < Y; y++) {
    rows[y] = new Array(X).fill([]);
  }
  return rows;
}
