import React, { ChangeEvent, useState } from "react";
import logo from "./logo.svg";
import { tier1Recipes } from "./data/tier1Recipes";
import "./App.css";
import { recipe, selectedRecipe } from "./data/itemTypes";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import SettingsIcon from "@mui/icons-material/Settings";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { tier2Recipes } from "./data/tier2Recipes";
import { tier3Recipes } from "./data/tier3Recipes";
import { tier4Recipes } from "./data/tier4Recipes";
import { useInputNumber } from "./hooks/useInputNumber";
import { useInputText } from "./hooks/useInputText";

function App() {
  const allItems = [
    ...tier1Recipes,
    ...tier2Recipes,
    ...tier3Recipes,
    ...tier4Recipes,
  ];
  const [printer, setPrinter] = useState(0);
  const [selected, setSelected] = useState<selectedRecipe[]>([]);
  const [page, setPage] = useState<number>(1);
  const [settingDialog, setSettingDialog] = useState(false);
  const [settingIndex, setSettingIndex] = useState<number>(0);
  const [resultDialog, setResultDialog] = useState(false);
  const [pageCount, setPageCount] = useState<number>(
    Math.ceil(allItems.length / 15)
  );
  const [items, setItems] = useState<recipe[]>(allItems.slice(0, 15));
  const amountInput = useInputText("");
  const [resultData, setResultData] = useState<{ [key: string]: number }>({});

  // ページが切り替わった時
  const handleChangePage = (e: ChangeEvent<unknown>, value: number) => {
    setPage(value);
    const startIndex = (value - 1) * 15;
    const endIndex = startIndex + 15;
    if (printer === 10) {
      setItems(allItems.slice(startIndex, endIndex));
    } else if (printer === 20) {
      setItems(tier2Recipes.slice(startIndex, endIndex));
    } else if (printer === 30) {
      setItems(tier3Recipes.slice(startIndex, endIndex));
    } else if (printer === 40) {
      setItems(tier4Recipes.slice(startIndex, endIndex));
    } else {
      setItems(allItems.slice(startIndex, endIndex));
    }
  };

  // プリンターを切り替えた時
  const handleChangeTier = (e: SelectChangeEvent) => {
    const tier = Number(e.target.value);
    setPrinter(Number(tier));
    if (tier === 10) {
      // set item tier1
      setItems(tier1Recipes.slice(0, 15));
      setPageCount(Math.ceil(tier1Recipes.length / 15));
    } else if (tier === 20) {
      setItems(tier2Recipes.slice(0, 15));
      setPageCount(Math.ceil(tier2Recipes.length / 15));
    } else if (tier === 30) {
      setItems(tier3Recipes.slice(0, 15));
      setPageCount(Math.ceil(tier3Recipes.length / 15));
    } else if (tier === 40) {
      setItems(tier4Recipes.slice(0, 15));
      setPageCount(Math.ceil(tier4Recipes.length / 15));
    } else {
      console.log("ELSE!!!");
      setItems(
        [
          ...tier1Recipes,
          ...tier2Recipes,
          ...tier3Recipes,
          ...tier4Recipes,
        ].slice(0, 15)
      );
      setPageCount(Math.ceil(allItems.length / 15));
    }
  };

  const handleClickItemButton = (r: selectedRecipe) => {
    // 選択されていなければ追加
    if (!selected.some((s) => s.recipe.id === r.recipe.id)) {
      setSelected([...selected, r]);
    }
  };

  // 増加ボタンを押した時
  const handleAddButton = (index: number) => {
    const newSelected = [...selected];
    newSelected[index].amount += 1;
    setSelected(newSelected);
  };

  // 減少ボタンを押した時
  const handleRemoveButton = (index: number) => {
    if (selected[index].amount > 1) {
      const newSelected = [...selected];
      newSelected[index].amount -= 1;
      setSelected(newSelected);
    }
  };

  const handleDeleteButton = (index: number) => {
    const newSelected = [...selected];
    newSelected.splice(index, 1);
    setSelected(newSelected);
  };

  // 設定ボタンを押した時
  const handleSettingButton = (index: number) => {
    setSettingDialog(true);
    setSettingIndex(index);
  };

  // 設定ボタンから個数を設定した時
  const handleAmountSettingButton = () => {
    const newSelected = [...selected];
    if (
      isNaN(Number(amountInput.value)) ||
      amountInput.value === "0" ||
      amountInput.value.match(/^0[0-9]+$/)
    ) {
      setSettingDialog(false);
      amountInput.initValue(String(selected[settingIndex].amount));
      console.log("invalida value");
      return;
    }

    if (Number(amountInput.value) > 999) {
      newSelected[settingIndex].amount = 999;
    } else {
      newSelected[settingIndex].amount = Number(amountInput.value);
    }
    setSettingDialog(false);
  };

  const handleCalculator = () => {
    // ここに計算ロジックを追加
    let result: { [key: string]: number } = {};
    selected.map((s: selectedRecipe) => {
      s.recipe.material.map((m: { name: string; amount: number }) => {
        if (result[m.name]) {
          result[m.name] += m.amount * s.amount;
        } else {
          result[m.name] = m.amount * s.amount;
        }
      });
    });
    setResultData(result);
    setResultDialog(true);
  };

  return (
    <Box className="App">
      {/* 計算結果 */}
      <Dialog
        open={resultDialog}
        onClose={() => {
          setResultDialog(false);
        }}
      >
        <Box className="p-3">
          <Box>
            <Typography variant="h6">必要素材数</Typography>
          </Box>
          <Box className="mt-3">
            {Object.keys(resultData).map((key) => (
              <Box key={key} className="flex space-y-1 items-center">
                <Box>{key}</Box>
                <Box className="ml-auto">{resultData[key]}個</Box>
              </Box>
            ))}
          </Box>
        </Box>
        <Box className="flex justify-end">
          <IconButton onClick={() => setResultDialog(false)}>
            <DoneIcon fontSize="large" color="success" />
          </IconButton>
        </Box>
      </Dialog>
      <Dialog
        open={settingDialog}
        onClose={() => {
          setSettingDialog(false);
        }}
      >
        <Box className="p-3">
          <DialogTitle>任意の個数を入力</DialogTitle>
          <Box>
            <TextField
              value={amountInput.value}
              onChange={amountInput.handleChange}
              variant="outlined"
              size="small"
              fullWidth
            />
            <Box className="flex justify-end">
              <IconButton onClick={handleAmountSettingButton}>
                <DoneIcon color="success" />
              </IconButton>
              <IconButton onClick={() => setSettingDialog(false)}>
                <CloseIcon color="error" />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Dialog>
      <Box className="text-3xl bg-primary text-white">
        Astroneer 必要素材計算
      </Box>
      <Box className="max-w-5xl mx-auto">
        <Box>
          <Box className="mt-5 flex flex-col gap-4">
            <FormControl size="small" fullWidth>
              <InputLabel id="demo-select-small-label">Tier</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={String(printer)}
                label="プリンター"
                onChange={handleChangeTier}
              >
                <MenuItem value={0}>全て</MenuItem>
                <MenuItem value={10}>バッグ</MenuItem>
                <MenuItem value={20}>小型プリンター</MenuItem>
                <MenuItem value={30}>中型プリンター</MenuItem>
                <MenuItem value={40}>大型プリンター</MenuItem>
              </Select>
            </FormControl>
            <Box>
              <Grid container rowSpacing={1} columnSpacing={1}>
                {items.map((r: recipe) => {
                  return (
                    <Grid size={4} key={r.name}>
                      <Button
                        color="primary"
                        variant="contained"
                        fullWidth
                        onClick={() => {
                          handleClickItemButton({ recipe: r, amount: 1 });
                        }}
                      >
                        {r.name}
                      </Button>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
            <Box className="flex justify-center">
              <Pagination
                page={page}
                count={pageCount}
                color="primary"
                onChange={handleChangePage}
              />
            </Box>
          </Box>
          <Box className="mt-5">
            <Box className="flex space-x-5 justify-center">
              <Button
                variant="contained"
                color="primary"
                onClick={handleCalculator}
                disabled={selected.length === 0}
              >
                計算
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => setSelected([])}
              >
                リセット
              </Button>
            </Box>
          </Box>
          <Box>
            {selected.map((sr: selectedRecipe, i: number) => {
              return (
                <Box key={sr.recipe.name} className="flex items-center">
                  <Box>{sr.recipe.name}</Box>
                  <Box className="ml-auto">{sr.amount}</Box>
                  <Box className="ml-2">
                    <IconButton onClick={() => handleAddButton(i)}>
                      <AddIcon />
                    </IconButton>
                    <IconButton onClick={() => handleRemoveButton(i)}>
                      <RemoveIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteButton(i)}>
                      <DeleteIcon />
                    </IconButton>
                    <IconButton onClick={() => handleSettingButton(i)}>
                      <SettingsIcon />
                    </IconButton>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default App;
