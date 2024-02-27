document.addEventListener('DOMContentLoaded', function ()
{
    document.getElementById('loginBtn').addEventListener('click', function ()
    {
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('signupForm').style.display = 'none';
        document.getElementById('responseMessage').textContent = '';
    });

    document.getElementById('signupBtn').addEventListener('click', function ()
    {
        document.getElementById('signupForm').style.display = 'block';
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('responseMessage').textContent = '';
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

        // localStorage.setItem('credentialId', btoa(String.fromCharCode.apply(null, credential.rawId)));

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
                        challenge: Uint8Array.from("MinA", c => c.charCodeAt(0)),
                        rp: {
                            name: "WebAuthnRegister"
                        },
                        user: {
                            id: Uint8Array.from(Date.now().toString(), c => c.charCodeAt(0)),
                            name: userName,
                            displayName: email
                        },
                        pubKeyCredParams: [{
                            type: "public-key",
                            alg: -7
                        }],
                        authenticatorSelection: {
                            authenticatorAttachment: "all supported",
                            userVerification: "required"
                        },
                        timeout: 60000,
                        attestation: "none",
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
                        challenge: Uint8Array.from("MinA", c => c.charCodeAt(0)),
                        rp: {
                            name: "WebAuthnRegister"
                        },

                        authenticatorSelection: {
                            userVerification: 'required',
                            attachment: 'all supported'
                        },
                        timeout: 60000
                        // allowCredentials: [{
                        //     type: "public-key",
                        //     // id: Uint8Array.from(credentialId, c => c.charCodeAt(0)),
                        //     // id: Uint8Array.from(atob(localStorage.getItem('credentialId')), c => c.charCodeAt(0)),
                        //     transports: ["internal"]
                        // }],
                    }
                }).then(credential =>
                {
                    if (credential)
                    {
                        if (credential.id == credentialId)
                            alert("Success");
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