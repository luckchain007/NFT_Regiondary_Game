import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  Box,
  Button,
  ButtonGroup,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { AppSelector } from "../../store";
import {
  filterAndPageState,
  updateFilterAndPageState,
} from "../../reducers/filterAndPage.reducer";
import { getTranslation } from "../../utils/utils";

type Props = {
  showSmall: boolean;
};

const WarriorLevelFilter: React.FC<Props> = ({ showSmall }) => {
  const dispatch = useDispatch();
  const { warriorFilterLevel } = AppSelector(filterAndPageState);

  const theme = useTheme();
  const isSmallerThanSM = useMediaQuery(theme.breakpoints.down("sm"));

  const handleLevelFilter = (level: Number) => {
    dispatch(
      updateFilterAndPageState({ warriorFilterLevel: level, currentPage: 1 })
    );
  };

  const handleChange = (event: SelectChangeEvent) => {
    dispatch(
      updateFilterAndPageState({
        warriorFilterLevel: event.target.value,
        currentPage: 1,
      })
    );
  };

  useEffect(() => {
    dispatch(updateFilterAndPageState({ warriorFilterLevel: 0 }));
  }, []);

  return (
    <Box>
      <Typography sx={{ mb: 1 }}>{getTranslation("filterbylevel")}</Typography>
      {isSmallerThanSM && showSmall ? (
        <>
          <Select
            value={warriorFilterLevel.toString()}
            onChange={handleChange}
            size={"small"}
          >
            <MenuItem value={0}>All</MenuItem>
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={4}>4</MenuItem>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={6}>6</MenuItem>
          </Select>
        </>
      ) : (
        <ButtonGroup>
          <Button
            variant={warriorFilterLevel === 0 ? "contained" : "outlined"}
            onClick={() => handleLevelFilter(0)}
          >
            {getTranslation("all")}
          </Button>
          <Button
            variant={warriorFilterLevel === 1 ? "contained" : "outlined"}
            onClick={() => handleLevelFilter(1)}
          >
            1
          </Button>
          <Button
            variant={warriorFilterLevel === 2 ? "contained" : "outlined"}
            onClick={() => handleLevelFilter(2)}
          >
            2
          </Button>
          <Button
            variant={warriorFilterLevel === 3 ? "contained" : "outlined"}
            onClick={() => handleLevelFilter(3)}
          >
            3
          </Button>
          <Button
            variant={warriorFilterLevel === 4 ? "contained" : "outlined"}
            onClick={() => handleLevelFilter(4)}
          >
            4
          </Button>
          <Button
            variant={warriorFilterLevel === 5 ? "contained" : "outlined"}
            onClick={() => handleLevelFilter(5)}
          >
            5
          </Button>
          <Button
            variant={warriorFilterLevel === 6 ? "contained" : "outlined"}
            onClick={() => handleLevelFilter(6)}
          >
            6
          </Button>
        </ButtonGroup>
      )}
    </Box>
  );
};

export default WarriorLevelFilter;
