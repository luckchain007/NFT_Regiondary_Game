import {
    Box,
    Card,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    FormControl,
    InputLabel,
    Select,
    SelectChangeEvent,
    
    Button,
    ButtonGroup,
    InputBase,
} from "@mui/material";
import TextField from '@mui/material/TextField';
import React, { useState, useEffect } from "react";
import { alpha, styled } from '@mui/material/styles';
import Link from '@mui/material/Link';
import {
    gameState,
    updateState,
} from "../../reducers/cryptolegions.reducer";
import { AppSelector } from "../../store";
import { SelectorFactory, useDispatch } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import { useWeb3 } from "../../web3hooks/useContract";
import { I_Legion, I_Division } from "../../interfaces";
import LanguageTranslate from "../../components/UI/LanguageTranslate";
import OrgMenuItem from "../../components/UI/OrgMenuItem";
import GreenMenuItem from "../../components/UI/GreenMenuItem";
import RedMenuItem from "../../components/UI/RedMenuItem";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FireBtn from "../Buttons/FireBtn";

const divisions: I_Division[] = [
    {
        minAP: 10000,
        maxAP: 13000,
        betPrice: 40,
    },
    {
        minAP: 13000,
        maxAP: 16000,
        betPrice: 60,
    },
    {
        minAP: 16000,
        maxAP: 20000,
        betPrice: 70,
    },
    {
        minAP: 20000,
        maxAP: 25000,
        betPrice: 100,
    },
    {
        minAP: 25000,
        maxAP: 30000,
        betPrice: 140,
    },
    {
        minAP: 30000,
        maxAP: 37000,
        betPrice: 190,
    },
    {
        minAP: 37000,
        maxAP: 45000,
        betPrice: 250,
    },
    {
        minAP: 45000,
        maxAP: 55000,
        betPrice: 400,
    },
    {
        minAP: 55000,
        maxAP: 70000,
        betPrice: 500,
    },
];

const allLegions1: I_Legion[] = [
    {
        id: "1",
        name: "hunter1",
        beastIds: [176, 175, 4286, 5581],
        warriorIds: [472, 474, 473, 5452, 16596, 16598],
        attackPower: 1879,
        supplies: 0,
        huntStatus: false,
        duelStatus: true,
        jpg: "/assets/images/characters/jpg/legions/0.jpg",
        mp4: "/assets/images/characters/mp4/legions/0.mp4",
        executeStatus: false,
    },
    {
        id: "2",
        name: "hunter2",
        beastIds: [176, 175, 4286, 5581],
        warriorIds: [472, 474, 473, 5452, 16596, 16598],
        attackPower: 60879,
        supplies: 0,
        huntStatus: false,
        duelStatus: true,
        jpg: "/assets/images/characters/jpg/legions/0.jpg",
        mp4: "/assets/images/characters/mp4/legions/0.mp4",
        executeStatus: false,
    },
    {
        id: "3",
        name: "hunter3",
        beastIds: [176, 175, 4286, 5581],
        warriorIds: [472, 474, 473, 5452, 16596, 16598],
        attackPower: 70879,
        supplies: 0,
        huntStatus: false,
        duelStatus: false,
        jpg: "/assets/images/characters/jpg/legions/0.jpg",
        mp4: "/assets/images/characters/mp4/legions/0.mp4",
        executeStatus: false,
    },
];

const PriceTextField = styled(TextField)({
    '& input.MuiInput-input': {
        paddingTop: '0px',
        paddingBottom: '0px',
        textAlign: "center",
    },

});

const LegionSelectInput = styled(InputBase)(({ theme }) => ({
    '.MuiSelect-select': {
        paddingBottom: "5px",
        textAlign: "right",
        border: '1px solid #ced4da',
    },
    '& .MuiInputBase-input': {
        borderRadius: 4,
        position: 'relative',
        border: '1px solid #ced4da',
        fontSize: 16,
        paddingLeft: 10,
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        // Use the system font instead of the default Roboto font.
        '&:focus': {
            borderRadius: 4,
            borderColor: '#80bdff',
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        }
    }
}));

const CreateDuelModal: React.FC = () => {
    const dispatch = useDispatch();
    const {
        allLegions,
        createDuelModalOpen,
    } = AppSelector(gameState);
    // Account & Web3
    const { account } = useWeb3React();
    const web3 = useWeb3();
    const [isOpen, setIsOpen] = useState(false);
    const [allIn, setAllIn] = useState(false);
    const [estimatePrice, setEstimatePrice] = useState(0);
    const [currentLegionIndex, setCurrentLegionIndex] = useState<number>(0);
    const [divisionIndex, setDivisionIndex] = useState(0);

    const handleSelectLegion = (e: SelectChangeEvent) => {
        const legionIndex = parseInt(e.target.value);
        setCurrentLegionIndex(legionIndex);
        divisions.map((division: I_Division, index: Number) => {
            if (allLegions1[legionIndex].attackPower >= division.minAP && allLegions1[legionIndex].attackPower < division.maxAP) {
                setDivisionIndex(index.valueOf());
            }
        })
    };
    const handleAllInCheck = () => {
        setAllIn(!allIn);
    }    
    const handleChangeEstimatePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
        const price = parseFloat(e.target.value);
        setEstimatePrice(price)
    }
    const handleClose = () => {
        dispatch(updateState({createDuelModalOpen: false}))
    }
    return (
        <Dialog open={createDuelModalOpen.valueOf()} onClose={handleClose}>
            <DialogTitle>Create Duel</DialogTitle>
            <DialogContent dividers>
                <Typography>What do you think the $BLST price in BUSD will be in exactly 24 hours from now?</Typography>
                <Box
                    sx={{
                        padding: "20px",
                        fontSize: "1.2em",
                        fontWeight: "bold",

                    }}
                >
                    <a href="https://pancakeswap.finance/swap?outputCurrency=0x63441E5C9F55B5A9141f3D834a28426Ca1c5C5cC&inputCurrency=BNB" target="_blank" style={{ color: "orange", textDecoration: "none" }}>Check Price Now</a>
                </Box>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4} lg={4}>Select your Legion :</Grid>
                    <Grid item xs={12} sm={6} md={6} lg={6} >
                        <FormControl>
                            <Select
                                id="hunt-legion-select"
                                value={currentLegionIndex.toString()}
                                onChange={handleSelectLegion}
                                input={<LegionSelectInput />}
                            >
                                {allLegions1.map((legion: I_Legion, index: number) =>
                                    !legion.duelStatus ? (
                                        <OrgMenuItem value={index} key={index}>
                                            {`#${legion.id} ${legion.name} (${legion.attackPower} AP)`}
                                        </OrgMenuItem>
                                    ) : legion.attackPower.valueOf() >= 10000 && legion.attackPower <= 70000 ? (
                                        <GreenMenuItem value={index} key={index}>
                                            {`#${legion.id} ${legion.name} (${legion.attackPower} AP)`}
                                        </GreenMenuItem>
                                    ) : <RedMenuItem value={index} key={index}>
                                        {`#${legion.id} ${legion.name} (${legion.attackPower} AP)`}
                                    </RedMenuItem>
                                )}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                {
                    !allLegions1[currentLegionIndex].duelStatus
                        ? <Box><Typography mt={1} mb={1}>Your legion is in the midst of a duel.</Typography></Box>
                        : allLegions1[currentLegionIndex].attackPower.valueOf() >= 10000 && allLegions1[currentLegionIndex].attackPower.valueOf() <= 70000
                            ? <Box>
                                <Typography mt={1} mb={1}>Your Legion's division : {divisions[divisionIndex].minAP.valueOf() / 1000}K - {divisions[divisionIndex].maxAP.valueOf() / 1000}K AP </Typography>
                                <Typography mb={1}>You will bet : ${divisions[divisionIndex].betPrice}</Typography>
                                <Typography mb={1}>You might lose up to {divisions[divisionIndex].maxAP.valueOf() / 10}AP</Typography>
                                <Typography mb={1}>You might win: ${2 * divisions[divisionIndex].betPrice.valueOf() * 0.8}</Typography>
                                <Grid container mb={1} spacing={1}>
                                    <Grid item xs={12} sm={4} md={4} lg={4}>I think 1 $BLST will be = </Grid>
                                    <Grid item xs={6} sm={4} md={4} lg={2}>
                                        <PriceTextField
                                            id="outlined-number"
                                            variant="standard"
                                            // InputLabelProps={{
                                            //     shrink: true,
                                            // }}
                                            type="number"
                                            value={estimatePrice}
                                            onChange={handleChangeEstimatePrice}
                                            sx={{ padding: "0 !important" }}
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={2} md={4} lg={1}>BUSD</Grid>
                                </Grid>

                                <Typography mb={1}>To Create this Duel, you must bet ${divisions[divisionIndex].betPrice.valueOf()} from your Unclaimed Wallet</Typography>
                                <Box sx={{display: "flex", alignItems:"center", flexDirection: "column"}}><FireBtn sx={{width: "100px"}}>Bet</FireBtn></Box>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox checked={allIn} onChange={handleAllInCheck}  defaultChecked />} label="All-In" />
                                </FormGroup>
                            </Box>
                            : <Box><Typography mt={1} mb={1}>Your legion's Attack Power is too high or low.</Typography></Box>
                }

            </DialogContent>
        </Dialog>
    );
};
export default CreateDuelModal;
