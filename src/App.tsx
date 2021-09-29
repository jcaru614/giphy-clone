import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import {
	Button,
	Stack,
	Pagination,
	Card,
	CardActions,
	CardContent,
	CardMedia,
	Typography,
	Box,
	TextField,
	Grid,
	AppBar,
	Toolbar,
} from '@mui/material';
import { FacebookIcon, FacebookShareButton } from 'react-share';

function App() {
	const API_KEY = process.env.REACT_APP_API_KEY;
	const BASE_URL = process.env.REACT_APP_BASE_URL;
	const [searchText, setSearchText] = useState('');
	const [result, setResult] = useState([]);
	const [pages, setPages] = useState([]);
	const [page, setPage] = useState([]);
	const [pageNumber, setPageNumber] = useState(1);

	const getTopTenGiphy = async () => {
		await axios
			.get(
				`${BASE_URL}/trending?api_key=${API_KEY}&limit=15
    `
			)
			.then((res) => {
				console.log('res 10', res.data);
				const topTen = res.data.data;
				setResult(topTen);
				setPages(topTen);
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const searchHandler = async () => {
		await axios
			.get(
				`${BASE_URL}/search?api_key=${API_KEY}&q=${searchText}&limit=100
    `
			)
			.then((res) => {
				console.log('search res ', res.data);
				const searchRes = res.data.data;
				setSearchText('');
				pageMaker(searchRes);
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const pageMaker = (searchRes: any) => {
		console.log('SEARACHRES ', searchRes);
		const pages: any = [];
		let page: any = [];
		let count = 0;
		for (let i = 0; i < searchRes.length; i++) {
			const element = searchRes[i];
			console.log(`before page & ${count}`, page);
			if (count === 10) {
				pages.push(page);
				page = [];
				count = 0;
			}
			console.log(`after page & ${count}`, page);
			page.push(element);
			count++;
			console.log('pages ', pages);
		}
		setPages(pages);
		setPage(pages[0]);
	};

	const onChangeHandler = (e: any) => {
		setSearchText(e.target.value);
		console.log('e ', e.target.value);
	};

	const handlePageChange = (event: any, value: any) => {
		console.log('value ', value);
		setPage(pages[value - 1]);
		setPageNumber(value);
	};

	useEffect(() => {
		getTopTenGiphy();
	}, []);

	return (
		<div className='App'>
			<Box sx={{ flexGrow: 1 }}>
				<AppBar position='static'>
					<Toolbar>
						<Typography
							variant='h6'
							noWrap
							component='div'
							sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
						>
							Giphy Clone
						</Typography>
						<Box m={3}>
							<TextField
								id='outlined-basic'
								label='Search Giphy Clone'
								variant='filled'
								color='success'
								onChange={onChangeHandler}
							/>
						</Box>
						<Box m={2}>
							<Button variant='contained' color='success' onClick={searchHandler}>
								Search
							</Button>
						</Box>
					</Toolbar>
				</AppBar>
			</Box>
			<div className='App-header'>
				<Grid container>
					{page.length > 0
						? page.map((item: any) => {
								return (
									<Grid item md={6}>
										<Card sx={{ maxWidth: 345, margin: 10 }}>
											<CardMedia component='img' height='100%' image={item.images.original.url} alt='green iguana' />
											<CardContent>
												<Typography gutterBottom variant='h5' component='div'>
													{item.title}
												</Typography>
											</CardContent>
											<CardActions>
												<Box m={2}>
													<Typography>Share With FB</Typography>
												</Box>
												<FacebookShareButton url={item.images.original.url} quote={item.title}>
													<FacebookIcon size={40} />
												</FacebookShareButton>
											</CardActions>
										</Card>
									</Grid>
								);
						  })
						: result.map((item: any) => {
								return (
									<Grid item md={6}>
										<Card sx={{ maxWidth: 345, margin: 10 }}>
											<CardMedia component='img' height='100%' image={item.images.original.url} alt='green iguana' />
											<CardContent>
												<Typography gutterBottom variant='h5' component='div'>
													{item.title}
												</Typography>
											</CardContent>
											<CardActions>
												<Box m={2}>
													<Typography>Share With FB</Typography>
												</Box>
												<FacebookShareButton url={item.images.original.url} quote={item.title}>
													<FacebookIcon size={40} />
												</FacebookShareButton>
											</CardActions>
										</Card>
									</Grid>
								);
						  })}
				</Grid>

				<Box m={5}>
					<Stack spacing={2} m={5}>
						<Pagination
							variant='outlined'
							page={pageNumber}
							onChange={handlePageChange}
							count={pages.length > 0 ? pages.length : 1}
							color='primary'
						/>
					</Stack>
				</Box>
			</div>
		</div>
	);
}

export default App;
