import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { Dialog, Box, Typography, Slider } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FaTimes } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import parse from "html-react-parser";
import { useWeb3React } from "@web3-react/core";
import { AppSelector, AppDispatch } from "../../store";
import { modalState, updateModalState } from "../../reducers/modal.reducer";
import { inventoryState } from "../../reducers/inventory.reducer";
import { getTranslation } from "../../utils/utils";
import constants from "../../constants";
import {
  useFeeHandler,
  useWeb3,
  useRewardPool,
} from "../../web3hooks/useContract";
import { getBLSTAmount } from "../../web3hooks/contractFunctions/feehandler.contract";
import { getSamaritanStars } from "../../web3hooks/contractFunctions/rewardpool.contract";

const PrettoSlider = styled(Slider)({
  background: "linear-gradient(to right, red, yellow , green)",
  padding: "0px !important",
  height: 16,
  "& .MuiSlider-rail": {
    background: "linear-gradient(to right, red, yellow , green)",
  },
  "& .MuiSlider-track": {
    border: "none",
    background: "transparent !important",
  },
  "& .MuiSlider-thumb": {
    height: 18,
    width: 10,
    top: 24,
    backgroundColor: "#f66810",
    border: "0px solid",
    borderRadius: "0",

    "&:before": {
      top: -16,
      height: 0,
      width: 0,
      border: "8px solid",
      borderColor: "transparent transparent #f66810 transparent",
      boxShadow: "none",
    },
  },
  "& .MuiSlider-thumb.Mui-active": {
    boxShadow: "none",
  },
  "& .MuiSlider-thumb: hover": {
    boxShadow: "none",
  },
  "& 	.MuiSlider-markLabel": {
    top: 30,
    color: "white",
  },
});
const CalculatorModal: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const reinvestPercentMark = [
    {
      value: 0,
      label: "0%",
    },
    {
      value: 50,
      label: "50%",
    },
    {
      value: 100,
      label: "100%",
    },
  ];
  const {
    reinvestedTotalUSD,
    additionalInvestment,
    totalClaimedUSD,
    unclaimedUSD,
    unclaimedBLST,
    futureReinvestPercentWhenClaim,
    futureReinvestPercentWhenReinvest,
  } = AppSelector(inventoryState);

  const { reinvestPercentCalculatorModalOpen } = AppSelector(modalState);

  const { account } = useWeb3React();

  const web3 = useWeb3();

  const feehandler = useFeeHandler();
  const rewardpool = useRewardPool();

  const [reinvestPercent, setReinvestPercent] = useState<number>(0);
  const [shouldClaimBLSTAmount, setShouldClaimBLSTAmount] = useState<number>(0);
  const [shouldReinvestBLSTAmount, setShouldReinvestBLSTAmount] =
    useState<number>(0);
  const [futureSamararitanStars, setFutureSamaritanStars] = useState<number>(0);
  const [investedTotalBLST, setInvestedTotalBLST] = useState<number>(0);
  const [reinvestedTotalBLST, setReinvestedTotalBLST] = useState<number>(0);
  const [totalClaimedBLST, setTotalClaimedBLST] = useState<number>(0);

  const investedTotalUSD =
    Number(reinvestedTotalUSD) + Number(additionalInvestment);
  const shouldClaimAmount =
    ((Number(investedTotalBLST) + Number(unclaimedBLST) / 10 ** 18) * 100 -
      Number(reinvestPercent) *
        (Number(reinvestedTotalBLST) +
          Number(totalClaimedBLST) +
          Number(unclaimedBLST) / 10 ** 18)) /
    100;

  useEffect(() => {
    setReinvestPercent(Number(futureReinvestPercentWhenReinvest));
    getBLSTAmountForCalculation();
  }, [reinvestPercentCalculatorModalOpen]);

  useEffect(() => {
    getBalance();
  }, [shouldClaimAmount]);

  useEffect(() => {
    getFutureSamaritanStarsFunc();
  }, [reinvestPercent]);

  const getBLSTAmountForCalculation = async () => {
    try {
      setInvestedTotalBLST(
        await getBLSTAmount(web3, feehandler, investedTotalUSD)
      );
      setReinvestedTotalBLST(
        await getBLSTAmount(web3, feehandler, reinvestedTotalUSD)
      );
      setTotalClaimedBLST(
        await getBLSTAmount(web3, feehandler, totalClaimedUSD)
      );
    } catch (e) {
      console.log(e);
    }
  };

  const getFutureSamaritanStarsFunc = async () => {
    const samaritanStars = await getSamaritanStars(
      rewardpool,
      account,
      reinvestPercent
    );
    setFutureSamaritanStars(samaritanStars);
  };

  const getBalance = async () => {
    try {
      let claimAmount = 0;
      if (Number(reinvestPercent) == Number(futureReinvestPercentWhenClaim)) {
        claimAmount = Number(unclaimedBLST) / 10 ** 18;
      } else if (
        Number(reinvestPercent) == Number(futureReinvestPercentWhenReinvest)
      ) {
        claimAmount = 0;
      } else {
        claimAmount = Number(shouldClaimAmount);
      }
      setShouldClaimBLSTAmount(claimAmount);
      setShouldReinvestBLSTAmount(
        Number(unclaimedBLST) / 10 ** 18 - Number(claimAmount)
      );
    } catch (e) {
      console.log(e);
    }
  };

  const handleClose = () => {
    dispatch(
      updateModalState({
        reinvestPercentCalculatorModalOpen: false,
      })
    );
  };

  const handleChange = (event: Event, newValue: number | number[]) => {
    if (Number(newValue) < Number(futureReinvestPercentWhenClaim)) {
      setReinvestPercent(Number(futureReinvestPercentWhenClaim));
    } else if (Number(newValue) > Number(futureReinvestPercentWhenReinvest)) {
      setReinvestPercent(Number(futureReinvestPercentWhenReinvest));
    } else {
      setReinvestPercent(newValue as number);
    }
  };

  return (
    <Dialog
      open={reinvestPercentCalculatorModalOpen}
      onClose={handleClose}
      PaperProps={{
        style: {
          backgroundColor: constants.color.popupBGColor,
          width: "560px",
        },
      }}
    >
      <Box sx={{ p: 2, display: "flex" }}>
        <MdClose
          style={{
            marginLeft: "auto",
            fontWeight: "bold",
            fontSize: 14,
            cursor: "pointer",
          }}
          onClick={handleClose}
        />
      </Box>
      <Box sx={{ p: 4, pt: 0 }}>
        <Typography>
          <span style={{ fontSize: 16, fontWeight: "bold" }}>
            {getTranslation("whatIsYourDesiredReinvestPercentage")}
          </span>
        </Typography>
      </Box>
      <Box sx={{ p: 4, pt: 0 }}>
        <PrettoSlider
          track="inverted"
          sx={{
            marginBottom: 4,
          }}
          aria-labelledby="track-inverted-slider"
          value={reinvestPercent}
          valueLabelFormat={(x) => `${x}%`}
          onChange={handleChange}
          marks={reinvestPercentMark}
        />
      </Box>
      <Box sx={{ p: 4, pt: 0 }}>
        <Typography>
          <span style={{ fontSize: 12 }}>
            {parse(
              getTranslation(
                "toGetAReinvestPercentageOfAndSamaritanStarsYouNeedTo",
                {
                  CL1: reinvestPercent,
                  CL2: futureSamararitanStars,
                }
              )
            )}
          </span>
        </Typography>
        <Typography>
          <span style={{ fontSize: 12 }}>
            {getTranslation("reinvest")}{" "}
            {Number(shouldReinvestBLSTAmount).toFixed(2)} $
            {getTranslation("blst")}
          </span>
        </Typography>
        <Typography>
          <span style={{ fontSize: 12 }}>
            {getTranslation("claim")} {Number(shouldClaimBLSTAmount).toFixed(2)}{" "}
            ${getTranslation("blst")}
          </span>
        </Typography>
      </Box>
    </Dialog>
  );
};

export default CalculatorModal;
