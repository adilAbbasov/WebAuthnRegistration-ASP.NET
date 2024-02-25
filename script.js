document.addEventListener('DOMContentLoaded', function ()
{
    document.getElementById('loginBtn').addEventListener('click', function ()
    {
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('signupForm').style.display = 'none';
    });

    document.getElementById('signupBtn').addEventListener('click', function ()
    {
        document.getElementById('signupForm').style.display = 'block';
        document.getElementById('loginForm').style.display = 'none';
    });

    document.getElementById('loginForm').addEventListener('submit', async function (event)
    {
        event.preventDefault();

        const userName = document.getElementById('loginUserName').value;
        const credentialId = await confirmUserName(userName);

        if (!credentialId)
        {
            document.getElementById('responseMessage').textContent = 'Login failed. User not found.';
            console.error('Error:', error);
            return;
        }

        const credential = await getCredentials(credentialId);

        if (!credential)
        {
            document.getElementById('responseMessage').textContent = 'Login failed. Credentials not found.';
            console.error('Error:', error);
            return;
        }

        const formData = new FormData(this);
        const jsonObject = {};

        formData.forEach((value, key) =>
        {
            jsonObject[key] = value;
        });

        jsonObject["fingerprintKey"] = credential.id;
        const jsonData = JSON.stringify(jsonObject);

        fetch('https://localhost:7244/controller/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: jsonData
        })
            .then(response =>
            {
                if (!response.ok)
                {
                    throw new Error('Login failed.');
                }
                return response.json();
            })
            .then(data =>
            {
                document.getElementById('responseMessage').textContent = 'Login successful';
            })
            .catch(error =>
            {
                document.getElementById('responseMessage').textContent = 'Login failed. Please try again.';
                console.error('Error:', error);
            });

        document.getElementById('loginUserName').value = '';
    });

    document.getElementById('signupForm').addEventListener('submit', async function (event)
    {
        event.preventDefault();

        var email = document.getElementById('email').value;
        var userName = document.getElementById('signupUserName').value;
        var credential = await createCredentials(email, userName);

        if (!credential)
        {
            document.getElementById('responseMessage').textContent = 'Signup failed. Credentials not created.';
            console.error('Error:', error);
            return;
        }

        const formData = new FormData(this);
        const jsonObject = {};

        formData.forEach((value, key) =>
        {
            jsonObject[key] = value;
        });

        jsonObject["fingerprintKey"] = credential.id;
        const jsonData = JSON.stringify(jsonObject);

        fetch('https://localhost:7244/controller/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: jsonData
        })
            .then(response =>
            {
                document.getElementById('responseMessage').textContent = credential.id;
            })
            .catch(error =>
            {
                document.getElementById('responseMessage').textContent = 'Signup failed. Please try again.';
                console.error('Error:', error);
            });

        document.getElementById('signupUserName').value = '';
        document.getElementById('email').value = '';
    });

    async function createCredentials(email, userName)
    {
        return new Promise((resolve, reject) =>
        {
            try
            {
                navigator.credentials.create({
                    publicKey: {
                        challenge: Uint8Array.from("MinA"),
                        rp: { name: "WebAuthnRegister" },
                        user: { id: Uint8Array.from(Date.now().toString()), name: email, displayName: userName },
                        pubKeyCredParams: [{ type: "public-key", alg: -7 }],
                        timeout: 60000
                    }
                }).then(credential =>
                {
                    if (credential)
                    {
                        resolve(credential);
                    } else
                    {
                        reject("No credential created");
                    }
                }).catch(error =>
                {
                    reject(error);
                });
            } catch (error)
            {
                reject(error);
            }
        });
    }

    async function getCredentials(credentialId)
    {
        return new Promise((resolve, reject) =>
        {
            try
            {
                navigator.credentials.get({
                    publicKey: {
                        challenge: Uint8Array.from("MinA"),
                        rp: { name: "WebAuthnRegister" },
                        // userVerification: "preferred",
                        allowCredentials: [{ type: "public-key", id: Uint8Array.from(credentialId.split('').map(char => char.charCodeAt(0))) }]
                    }
                    // publicKey: {
                    //     timeout: 60000
                    // }
                }).then(credential =>
                {
                    if (credential)
                    {
                        resolve(credential);
                    } else
                    {
                        reject("No credential found");
                    }
                }).catch(error =>
                {
                    reject(error);
                });
            } catch (error)
            {
                reject(error);
            }
        });
    }

    async function confirmUserName(userName)
    {
        try
        {
            const response = await fetch(`https://localhost:7244/controller/users/${userName}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok)
            {
                if (response.status === 404)
                {
                    console.log("User not found.");
                    return null;
                } else
                {
                    console.error("Failed to fetch data. Status code:", response.status);
                    throw new Error(`Failed to fetch data. Status code: ${response.status}`);
                }
            }

            const fingerprintKey = await response.text();

            if (fingerprintKey !== null && fingerprintKey !== '')
            {
                console.log("Fingerprint Key:", fingerprintKey);
            } else
            {
                console.log("Empty response received.");
            }

            return fingerprintKey;
        } catch (error)
        {
            console.error('Error:', error);
            throw error;
        }
    }

});













// document.addEventListener('DOMContentLoaded', function ()
// {
//     document.getElementById('loginForm').addEventListener('submit', function (event)
//     {
//         event.preventDefault(); // Prevent the form from submitting normally

//         var username = document.getElementById('username').value;
//         var fingerprintKey = document.getElementById('password').value;

//         // Make fetch request to login endpoint
//         fetch('https://your-api-domain.com/login', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ username: username, password: password })
//         })
//             .then(response =>
//             {
//                 if (!response.ok)
//                 {
//                     throw new Error('Login failed.');
//                 }
//                 return response.json();
//             })
//             .then(data =>
//             {
//                 // Handle successful login
//                 document.getElementById('responseMessage').textContent = 'Login successful';
//                 // Redirect or perform other actions as needed
//             })
//             .catch(error =>
//             {
//                 // Handle login failure
//                 document.getElementById('responseMessage').textContent = 'Login failed. Please try again.';
//                 console.error('Error:', error);
//             });
//     });

//     async function authenticateWithBiometrics()
//     {
//         try
//         {
//             const credential = await navigator.credentials.create({
//                 publicKey: {
//                     challenge: Uint8Array.from("some-random-bytes"),
//                     rp: { name: "Example Corp" },
//                     user: { id: Uint8Array.from("some-user-id"), name: "user@example.com", displayName: "User" },
//                     pubKeyCredParams: [{ type: "public-key", alg: -7 }],
//                     timeout: 60000
//                 }
//             });

//             if (credential)
//             {
//                 document.getElementById("status").innerHTML = "Biometric authentication successful!";
//                 console.log("Biometric authentication successful!", credential);
//             } else
//             {
//                 document.getElementById("status").innerHTML = "Biometric authentication failed!";
//                 console.error("Biometric authentication failed!");
//             }
//         } catch (error)
//         {
//             console.error("Error during biometric authentication:", error);
//             document.getElementById("status").innerHTML = "Error during biometric authentication: " + error;
//         }
//     }
// });
