import React, { useContext } from "react";
import './login.css'

import { AuthContext } from "../../context/auth";

import {
  Grid,
  TextField,
  Paper,
  Button,
  InputAdornment,
  IconButton,
  FormControl
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Login = () => {
  const [values, setValues] = React.useState({
    keepConnected: false,
    email: '',
    password: '',
    showPassword: false,
  });

  const { login } = useContext(AuthContext)
  const showValues = () => {
    if (!values.email && !values.password) {
      alert("Preencha os campos!")
      return
    }

    login(values.email, values.password)
  }
  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div className="centerContainer">
      <Paper elevation={3} style={{ padding: 30, 'maxWidth': '300px', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
        <FormControl>
          <Grid
            container
            spacing={3}
            justify={'center'}
            alignItems={'center'}
          >
            <Grid item xs={12}>
              <TextField fullWidth
                label="Email"
                onChange={handleChange('email')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth
                label="Senha"
                type={values.showPassword ? 'text' : 'password'}
                value={values.password}
                onChange={handleChange('password')}
                InputProps={{
                  endAdornment: (
                    <InputAdornment
                      position="end">
                      <IconButton
                        disabled={!values.password.length > 0}
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {values.showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              ></TextField>
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                onClick={showValues}
              > Entrar </Button>
            </Grid>
          </Grid>
        </FormControl>
      </Paper>
    </div>
  )
}

export default Login