import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
} from "@chakra-ui/react";
import axios from "axios";
import API_URL from "../helper";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [inputEmail, setInputEmail] = useState("");

  const navigate = useNavigate();

  const onBtnReset = () => {
    axios.get(API_URL + "/users/resetpass?email=" + inputEmail)
      .then((res) => {
        alert(res.data.message);
        navigate("/login");
      })
      .catch((err) => {
        console.log(err);
        alert(err.response.data.message);
      });
  };

  return (
    <Box maxW="400px" mx="auto" mt="10">
      <Heading size="md" mb="5" textAlign='center'>
        Reset Password
      </Heading>
      <Box
        py={{
          base: "0",
          sm: "8",
        }}
        px={8}
        bg={{
          base: "transparent",
          sm: "bg-surface",
        }}
        borderRadius={{
          base: "0px",
          sm: "8px",
        }}
        border={{
          base: "0px",
          md: "1px"
        }}
        borderColor={['', null, 'blue.400']}
      >
        <Stack spacing="6">
          <Stack spacing="5">
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                id="email"
                type="email"
                onChange={(element) => setInputEmail(element.target.value)}
              />
            </FormControl>
          </Stack>
          <Stack spacing="5">
            <Button colorScheme="blue" variant="solid" onClick={onBtnReset}>
              Reset Password
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default ResetPassword;
