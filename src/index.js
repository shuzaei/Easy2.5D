import React from "react";
import ReactDOM from "react-dom";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import AddIcon from "@material-ui/icons/Add";
import Drawer from "@material-ui/core/Drawer";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import "./index.css";

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

function createImageDataUrl(src, y, x, r) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = r;
  canvas.height = r;

  let img = new Image();
  img.src = src;
  let YS = img.height / 3,
    XS = img.width / 3;
  ctx.drawImage(img, x * XS, y * YS, XS, YS, 0, 0, r, r);

  return canvas.toDataURL();
}

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {
        <div className="pixel">
          {props.images.map((img, i) => (
            <img
              className="img"
              src={createImageDataUrl(
                img.src,
                Math.floor(img.num / 3),
                img.num % 3,
                props.r
              )}
              alt=""
              width={props.r}
              height={props.r}
            ></img>
          ))}
        </div>
      }
    </button>
  );
}

class Canvas extends React.Component {
  renderSquare(i, j, imgs) {
    return (
      <Square
        key={i * this.props.sizeX + j}
        name={(i * this.props.sizeX + j) * 30}
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
              onClick={() => {
                handleClose();
                console.log(i);
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
              onClick={() => {
                handleClose2();
                console.log(i);
                props.setColor(i);
              }}
            >
              {<img src={color} alt=""></img>}
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
          processed: createCanvas2(16, 16, "img/none.png", 4),
        },
      ],
      stepNumber: 0,
      sizeX: 16, // default
      sizeY: 16, // default
      colorSets: [
        {
          name: "default",
          body: [
            "img/none.png",
            "img/Z.png",
            "img/T.png",
            "img/J.png",
            "img/I.png",
            "img/O.png",
            "img/S.png",
            "img/L.png",
          ],
          side: [
            "img/none.png",
            "img/Z2.png",
            "img/T2.png",
            "img/J2.png",
            "img/I2.png",
            "img/O2.png",
            "img/S2.png",
            "img/L2.png",
          ],
          shade: [
            "img/none.png",
            "img/Shade.png",
            "img/Shade.png",
            "img/Shade.png",
            "img/Shade.png",
            "img/Shade.png",
            "img/Shade.png",
            "img/Shade.png",
          ],
        },
      ],
      selectColorSetNumber: 0,
      selectColorNumber: 1,
      sizeOfSquare: 36,
      showInitMenu: false,
    };
  }
  ShowInitMenu() {
    return (
      <div>
        <TextField required id="fileName" label="ファイル名"></TextField>
        <TextField required id="sizeX" label="サイズX"></TextField>
        <TextField required id="sizeY" label="サイズY"></TextField>
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
    console.log(i);
    this.setState({ selectColorSetNumber: i });
  }
  setColor(i) {
    console.log(i);
    this.setState({ selectColorNumber: i });
  }
  culcCanvas(canvas) {
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
            this.setState({ showInitMenu: false });
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
    rows[y] = new Array(X).fill([{ src: src, num: 4 }]);
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
