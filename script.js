// Function to register a user
function register()
{
    const username = document.getElementById('username').value;
    if (!username)
    {
        alert('Please enter a username.');
        return;
    }
    const publicKeyCredentialCreationOptions = {
        challenge: new Uint8Array(32), // Generate a challenge
        rp: { name: 'Example Corp' },
        user: { id: new Uint8Array(16), name: username, displayName: username },
        pubKeyCredParams: [{ type: 'public-key', alg: -7 }],
        authenticatorSelection: { authenticatorAttachment: 'platform' },
        timeout: 60000,
    };

    navigator.credentials.create({ publicKey: publicKeyCredentialCreationOptions })
        .then((newCredential) =>
        {
            // Store the credential data in local storage
            localStorage.setItem('credential', JSON.stringify(newCredential));
            alert('Registration successful!');
        })
        .catch((err) =>
        {
            console.error(err);
            alert('Registration failed.');
        });
}

// Function to login user
function login()
{
    const username = document.getElementById('loginUsername').value;
    if (!username)
    {
        alert('Please enter a username.');
        return;
    }

    // Retrieve credential data from local storage
    const credentialData = JSON.parse(localStorage.getItem('credential'));
    if (!credentialData)
    {
        alert('No credential found. Please register first.');
        return;
    }

    const publicKeyCredentialRequestOptions = {
        challenge: new Uint8Array(32), // Generate a challenge
        timeout: 60000,
        userVerificatio: "required",
        allowCredentials: [{
            type: credentialData.type,
            // id: Uint8Array.from(credentialData.id),
            transports: ['internal']
        }],
    };

    navigator.credentials.get({ publicKey: publicKeyCredentialRequestOptions })
        .then(() =>
        {
            alert('Login successful!');
        })
        .catch((err) =>
        {
            console.error(err);
            alert('Login failed.');
        });
}



// document.addEventListener('DOMContentLoaded', function ()
// {
//     document.getElementById('loginBtn').addEventListener('click', function ()
//     {
//         document.getElementById('loginForm').style.display = 'block';
//         document.getElementById('signupForm').style.display = 'none';
//         document.getElementById('responseMessage').textContent = '';
//     });

//     document.getElementById('signupBtn').addEventListener('click', function ()
//     {
//         document.getElementById('signupForm').style.display = 'block';
//         document.getElementById('loginForm').style.display = 'none';
//         document.getElementById('responseMessage').textContent = '';
//     });

//     document.getElementById('loginForm').addEventListener('submit', async function (event)
//     {
//         event.preventDefault();

//         const userName = document.getElementById('loginUserName').value;
//         const credentialId = await confirmUserName(userName);

//         if (!credentialId)
//         {
//             document.getElementById('responseMessage').textContent = 'Login failed. User not found.';
//             console.error('Error:', error);
//             return;
//         }

//         const credential = await getCredentials(credentialId);

//         if (!credential)
//         {
//             document.getElementById('responseMessage').textContent = 'Login failed. Credentials not found.';
//             console.error('Error:', error);
//             return;
//         }

//         const formData = new FormData(this);
//         const jsonObject = {};

//         formData.forEach((value, key) =>
//         {
//             jsonObject[key] = value;
//         });

//         jsonObject["fingerprintKey"] = credential.id;
//         const jsonData = JSON.stringify(jsonObject);

//         fetch('https://localhost:7244/controller/login', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: jsonData
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
//                 document.getElementById('responseMessage').textContent = 'Login successful';
//             })
//             .catch(error =>
//             {
//                 document.getElementById('responseMessage').textContent = 'Login failed. Please try again.';
//                 console.error('Error:', error);
//             });

//         document.getElementById('loginUserName').value = '';
//     });

//     document.getElementById('signupForm').addEventListener('submit', async function (event)
//     {
//         event.preventDefault();

//         var email = document.getElementById('email').value;
//         var userName = document.getElementById('signupUserName').value;
//         var credential = await createCredentials(email, userName);

//         if (!credential)
//         {
//             document.getElementById('responseMessage').textContent = 'Signup failed. Credentials not created.';
//             console.error('Error:', error);
//             return;
//         }

//         const formData = new FormData(this);
//         const jsonObject = {};

//         formData.forEach((value, key) =>
//         {
//             jsonObject[key] = value;
//         });

//         jsonObject["fingerprintKey"] = credential.id;
//         const jsonData = JSON.stringify(jsonObject);

//         fetch('https://localhost:7244/controller/signup', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: jsonData
//         })
//             .then(response =>
//             {
//                 document.getElementById('responseMessage').textContent = credential.id;
//             })
//             .catch(error =>
//             {
//                 document.getElementById('responseMessage').textContent = 'Signup failed. Please try again.';
//                 console.error('Error:', error);
//             });

//         document.getElementById('signupUserName').value = '';
//         document.getElementById('email').value = '';
//     });

//     async function createCredentials(email, userName)
//     {
//         return new Promise((resolve, reject) =>
//         {
//             try
//             {
//                 navigator.credentials.create({
//                     publicKey: {
//                         challenge: Uint8Array.from("MinA", c => c.charCodeAt(0)),
//                         rp: {
//                             name: "WebAuthnRegister"
//                         },
//                         user: {
//                             id: Uint8Array.from(Date.now().toString(), c => c.charCodeAt(0)),
//                             name: email,
//                             displayName: userName
//                         },
//                         pubKeyCredParams: [{
//                             type: "public-key",
//                             alg: -7
//                         }],
//                         authenticatorSelection: {
//                             authenticatorAttachment: "cross-platform",
//                         },
//                         timeout: 60000,
//                         attestation: "direct"
//                     }
//                 }).then(credential =>
//                 {
//                     if (credential)
//                     {
//                         resolve(credential);
//                     } else
//                     {
//                         reject("No credential created");
//                     }
//                 }).catch(error =>
//                 {
//                     reject(error);
//                 });
//             } catch (error)
//             {
//                 reject(error);
//             }
//         });
//     }

//     async function getCredentials(credentialId)
//     {
//         return new Promise((resolve, reject) =>
//         {
//             try
//             {
//                 navigator.credentials.get({
//                     publicKey: {
//                         challenge: Uint8Array.from("MinA", c => c.charCodeAt(0)),
//                         allowCredentials: [{
//                             type: "public-key",
//                             id: Uint8Array.from(credentialId, c => c.charCodeAt(0)),
//                             transports: ["internal"]
//                         }],
//                         authenticatorSelection: {
//                             userVerification: 'required',
//                             attachment: 'cross-platform'
//                         },
//                         timeout: 60000
//                     }
//                 }).then(credential =>
//                 {
//                     if (credential)
//                     {
//                         resolve(credential);
//                     } else
//                     {
//                         reject("No credential found");
//                     }
//                 }).catch(error =>
//                 {
//                     reject(error);
//                 });
//             } catch (error)
//             {
//                 reject(error);
//             }
//         });
//     }

//     async function confirmUserName(userName)
//     {
//         try
//         {
//             const response = await fetch(`https://localhost:7244/controller/users/${userName}`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 }
//             });

//             if (!response.ok)
//             {
//                 if (response.status === 404)
//                 {
//                     console.log("User not found.");
//                     return null;
//                 } else
//                 {
//                     console.error("Failed to fetch data. Status code:", response.status);
//                     throw new Error(`Failed to fetch data. Status code: ${response.status}`);
//                 }
//             }

//             const fingerprintKey = await response.text();

//             if (fingerprintKey !== null && fingerprintKey !== '')
//             {
//                 console.log("Fingerprint Key:", fingerprintKey);
//             } else
//             {
//                 console.log("Empty response received.");
//             }

//             return fingerprintKey;
//         } catch (error)
//         {
//             console.error('Error:', error);
//             throw error;
//         }
//     }
// });
