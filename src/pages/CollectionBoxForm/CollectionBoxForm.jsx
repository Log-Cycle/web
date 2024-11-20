import React, { useState, useEffect } from "react";
import {
    Grid,
    Divider,
    Button,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    CircularProgress,
    Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import MenuAppBar from "../../components/appBar/MenuAppBar";
import firebase from "../../service/firebase";

const CollectionBoxForm = () => {
    const [title, setName] = useState("");
    const [height, setHeight] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [listBoxs, setList] = useState([]);
    const [loading, setLoading] = useState(false); 

    const handleSubmit = async () => {
        if (!title || !height || !latitude || !longitude) {
            alert("Por favor, preencha todos os campos.");
            return;
        }
        const formData = { title, height, latitude, longitude };
        await firebase.addItemsToCollectionBox([formData]);
        setName("")
        setHeight("")
        setLatitude("")
        setLongitude("")
        getPoints(); 
    };

    const getPoints = async () => {
        const list = await firebase.getCollectionBoxs();
        setList(list);
    };

    const handleDelete = async (id) => {
        setLoading(true); 
        await firebase.deleteItemFromCollectionBox(id);
        await getPoints(); 
        setLoading(false); 
    };

    useEffect(() => {
        getPoints();
    }, []);

    return (
        <div>
            <MenuAppBar />
            <div className="space">
                <h2>Cadastro</h2>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={3}>
                        <TextField
                            label="Nome"
                            value={title}
                            onChange={(e) => setName(e.target.value)}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField
                            label="Altura"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField
                            label="Latitude"
                            value={latitude}
                            onChange={(e) => setLatitude(e.target.value)}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField
                            label="Longitude"
                            value={longitude}
                            onChange={(e) => setLongitude(e.target.value)}
                            fullWidth
                        />
                    </Grid>
                </Grid>
                <Divider sx={{ my: 1 }} />
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <Button
                            sx={{ background: "#16ab05" }}
                            variant="contained"
                            onClick={handleSubmit}
                        >
                            Cadastrar
                        </Button>
                    </Grid>
                </Grid>

                <div className="space">
                    <h2>Pontos Cadastrados</h2>
                    {loading ? (
                        <Grid container justifyContent="center" alignItems="center" style={{ height: '200px' }}>
                            <CircularProgress />
                            <Typography variant="body1" ml={2}>Deletando...</Typography>
                        </Grid>
                    ) : (
                        <TableContainer component={Paper}>
                            <Table aria-label="Tabela de pontos cadastrados">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Nome</TableCell>
                                        <TableCell>Altura</TableCell>
                                        <TableCell>Latitude</TableCell>
                                        <TableCell>Longitude</TableCell>
                                        <TableCell>Ações</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {listBoxs.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{item.title}</TableCell>
                                            <TableCell>{item.height}</TableCell>
                                            <TableCell>{item.latitude}</TableCell>
                                            <TableCell>{item.longitude}</TableCell>
                                            <TableCell>
                                                <IconButton
                                                    color="error"
                                                    onClick={() => handleDelete(item.id)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CollectionBoxForm;
