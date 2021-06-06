const getState = ({ getStore, getActions, setStore }) => {
	let base_url = process.env.BACKEND_URL;
	// let base_url = "https://3001-green-cockroach-u3tjlvcb.ws-us08.gitpod.io";
	return {
		store: {
			message: null,
			user: [],
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			],
			user: {
				id: "1",
				email: "email@gmail.com",
				loggedin: "false"
			},
			bookmarkData: [],
			gunData: []
		},
		actions: {
			// Use getActions to call a function within a function
			setAlert: payload => {
				/* payload should be an object with the following shape:
                    {
                        type: "",
                        msg: "",
                        show: false
                    }
                    type either: danger, success, warning
                */
				setStore({ alert: payload });
			},

			signup: data => {
				const store = getStore();
				console.log("data received", data);
				console.log(JSON.stringify(data));
				return fetch(`${base_url}/api/signup/`, {
					method: "POST",
					// mode: "no-cors",
					headers: { "Content-type": "application/json" },
					body: JSON.stringify(data)
				})
					.then(res => {
						if (!res.ok) throw new Error(res.statusText);

						return res.json();
					})
					.then(data => {
						console.log("data ", data);
						getActions().setAlert({
							type: "success",
							msg: data.msg,
							show: true
						});

						return true;
					})
					.catch(err => console.error(err));

				//reset the global store
				// setStore({ demo: demo });
			},
			// login: (email, password) => {
			// 	console.log("data received", email, " ", password);
			// 	console.log(JSON.stringify(email, password));
			// 	return fetch(`${base_url}/api/login/`, {
			// 		method: "POST",
			// 		// cors: "no-cors",
			// 		headers: {
			// 			"Content-Type": "application/json"
			// 		},
			// 		body: JSON.stringify({
			// 			email: email,
			// 			password: password
			// 		})
			// 	})
			// 		.then(res => res.json())
			// 		.then(data => {
			// 			if (typeof data.user === "undefined") throw new Error(data.msg);

			// 			// add token and info to local storage
			// 			sessionStorage.setItem(
			// 				"guniverse_user",
			// 				JSON.stringify({
			// 					token: data.token,
			// 					email: data.user.email,
			// 					id: data.user.id
			// 				})
			// 			);
			// 		})
			// 		.catch(err =>
			// 			getActions().setAlert({
			// 				type: "danger",
			// 				msg: err.message,
			// 				show: true
			// 			})
			// 		);
			// },
			getGunData: () => {
				// fetching data from the backend
				fetch(process.env.BACKEND_URL + "/api/guns")
					.then(resp => resp.json())
					.then(data => setStore({ gunData: data }))
					.catch(error => console.log("Error loading message from backend", error));
			},
			getBookmarkData: () => {
				// fetching data from the backend
				fetch(process.env.BACKEND_URL + "/api/bookmark/user/" + getStore().user.id)
					.then(resp => resp.json())
					.then(data => {
						console.log("data ", data);
						setStore({ bookmarkData: data });
					})
					.catch(error => console.log("Error loading message from backend", error));
			}
		}
	};
};

export default getState;
