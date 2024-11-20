import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Popup, Marker } from "react-leaflet";
import MenuAppBar from "../../components/appBar/MenuAppBar";
import { db } from "../../service/firebase";
import { onSnapshot, collection } from "firebase/firestore";
import { Box, LinearProgress, Typography, Divider } from '@mui/material';
import L from "leaflet";
import "./maps.css";

const startPosition = [-8.051151, -34.904486];

const iconConfig = {
    iconUrl: '',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
}

const defaultIcon = new L.Icon({ ...iconConfig, iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png' });

const redIcon = new L.Icon({ ...iconConfig, iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png' });


export default function Maps() {
    const [dataPoints, setDataPoints] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(db, "collectionBoxs"),
            (snapshot) => {
                const points = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setDataPoints(points);
                setLoading(false);
            },
            (error) => {
                console.error("Erro ao obter dados em tempo real:", error);
            }
        );

        return () => unsubscribe();
    }, []);

    return (
        <>
            <MenuAppBar />
            <div className="dashboardMapFirst">
                <MapContainer
                    center={startPosition}
                    zoom={12}
                    style={{ height: '100%' }}
                    preferCanvas={true}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {dataPoints.map((collectionBox) => (
                        <Marker
                            key={collectionBox.id}
                            position={[collectionBox.latitude, collectionBox.longitude]}
                            icon={collectionBox.level === 100 ? redIcon : defaultIcon}
                        >
                            <Popup className="request-popup">
                                <h2><strong>{collectionBox.title}</strong></h2>
                                <h3>Endereço: {collectionBox.address}</h3>

                                <h3>
                                    Navegar para o local:
                                    <a
                                        href={`https://www.google.com/maps/dir/?api=1&destination=${collectionBox.latitude},${collectionBox.longitude}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Abrir no Google Maps
                                    </a>
                                </h3>

                                <Divider />
                                <Box display="flex" flexDirection="column" alignItems="center" width="100%">
                                    <Typography variant="h6" gutterBottom>
                                        Nível da Caixa
                                    </Typography>
                                    <Box display="flex" alignItems="center" width="100%">
                                        <LinearProgress
                                            variant="determinate"
                                            value={collectionBox.level ? collectionBox.level : 0}
                                            style={{ width: '100%', height: 20, borderRadius: 5 }}
                                        />
                                        {`${collectionBox.level ? (collectionBox.level).toFixed(2) : 0}%`}
                                    </Box>
                                </Box>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </>
    );
}
