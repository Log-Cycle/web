import React, { useState } from "react";
import {
    Grid,
    Button,
    Typography,
    CircularProgress,
    Paper
} from '@mui/material';
import MenuAppBar from "../../components/appBar/MenuAppBar";

const CheckBox = () => {
    const [photo, setPhoto] = useState(null);
    const [loading, setLoading] = useState(false);
    const [itemInfo, setItemInfo] = useState("");
    const [gptSummary, setGptSummary] = useState("");

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(",")[1]); 
            reader.onerror = (error) => reject(error);
        });
    };

    const analyzePhotoWithGoogleVision = async (base64Image) => {
        setLoading(true);
        setItemInfo("");
        setGptSummary("");

        try {
            const response = await fetch(
                `https://vision.googleapis.com/v1/images:annotate?key=${process.env.REACT_APP_GOOGLE_VISION_TOKEN}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        requests: [
                            {
                                image: { content: base64Image },
                                features: [{ type: "LABEL_DETECTION", maxResults: 1 }],
                                imageContext: { languageHints: ["pt"] }
                            }
                        ]
                    })
                }
            );

            const data = await response.json();
            const description = data.responses[0]?.labelAnnotations[0]?.description || "Nenhuma descrição disponível.";
            setItemInfo(description);

            if (description) {
                fetchGPTSummary(description);
            }
        } catch (error) {
            console.error("Erro ao analisar a foto:", error);
            setItemInfo("Erro ao identificar o item.");
        } finally {
            setLoading(false);
        }
    };

    const fetchGPTSummary = async (itemName) => {
        setLoading(true);

        try {
            
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": process.env.REACT_APP_GPT_AUTHORIZATION
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo-1106",
                    messages: [
                        { role: "system", content: "Você é um assistente especializado em reciclagem e materiais. Precisa descrever as informaçoes que o usuario pedir em no maximo 130 tokens. Ele vai enviar o nome de um item em ingles, Traduza o nome tambem." },
                        { role: "user", content: `Diga quais materiais recicláveis estão presentes em um ${itemName} e como eles podem ser reaproveitados.` }
                    ],
                    max_tokens: 130,
                    temperature: 0.5
                })
            });

            const data = await response.json();
            const gptText = data.choices[0]?.message?.content.trim() || "Nenhuma informação disponível sobre reciclagem.";
            setGptSummary(gptText);
        } catch (error) {
            console.error("Erro ao buscar informações do GPT:", error);
            setGptSummary("Erro ao buscar informações sobre reciclagem.");
        } finally {
            setLoading(false);
        }
    };

    const handleCapture = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const photoURL = URL.createObjectURL(file);
            setPhoto(photoURL);
            const base64Image = await convertToBase64(file);
            analyzePhotoWithGoogleVision(base64Image);
        }
    };

    return (
        <div>
            <MenuAppBar />
            <div className="space">
                <h2>Identificar Item</h2>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <Button
                            variant="contained"
                            component="label"
                            color="primary"
                            fullWidth
                        >
                            Tirar Foto
                            <input
                                type="file"
                                accept="image/*"
                                capture="environment"
                                hidden
                                onChange={handleCapture}
                            />
                        </Button>
                    </Grid>

                    {photo && (
                        <Grid item xs={12} md={4}>
                            <div style={{ marginTop: 20 }}>
                                <Typography variant="subtitle1">Foto Capturada:</Typography>
                                <img
                                    src={photo}
                                    alt="Captura do item"
                                    style={{
                                        width: '100%',
                                        maxWidth: 200,
                                        height: 'auto',
                                        borderRadius: 8,
                                        border: '1px solid #ccc',
                                        padding: 4
                                    }}
                                />
                            </div>
                        </Grid>
                    )}

                    <Grid item xs={12}>
                        {loading ? (
                            <CircularProgress />
                        ) : (
                            <Paper style={{ padding: 16, marginTop: 20 }}>
                                <Typography variant="body1">{itemInfo || "Tire uma foto para identificar o item."}</Typography>
                                {gptSummary && (
                                    <>
                                        <Typography variant="subtitle1" style={{ marginTop: 16 }}>Resumo de materiais recicláveis:</Typography>
                                        <Typography variant="body2">{gptSummary}</Typography>
                                    </>
                                )}
                            </Paper>
                        )}
                    </Grid>
                </Grid>
            </div>
        </div>
    );
};

export default CheckBox;
