import Header from '../components/Header'
import connectMongo from '../../utils/dbConnect'
import Posts from '../../models/post.model'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { format } from 'date-fns';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { useTheme } from '@mui/material/styles';
import { CSVLink } from 'react-csv'
import { useRouter } from 'next/router';
import { getSession, useSession } from 'next-auth/react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import SearchBar from "material-ui-search-bar";
import { Button, Box } from "@mui/material";
import { styled } from '@mui/material/styles';
import { Dialog, DialogActions, DialogTitle } from '@mui/material'

interface TablePaginationActionsProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (
        event: React.MouseEvent<HTMLButtonElement>,
        newPage: number,
    ) => void;
}

const Input = styled('input')({
    display: 'none',
});

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function TablePaginationActions(props: TablePaginationActionsProps) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (
        event: React.MouseEvent<HTMLButtonElement>,
    ) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </Box>
    );
}

function Post({ posts }) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchValue, setSearchValue] = useState('');
    const router = useRouter();
    const { data: session }: any = useSession();
    const [open, setOpen] = useState(false);
    const [success, setsuccess] = useState(false);
    const [postRow, setpostRow] = useState(posts);
    const [alertopen, setAlertOpen] = React.useState(false);
    const [file, setFile] = useState("");
    const [userID, setUserID] = useState("");
    const [message, setmessage] = useState("successfully Added");

    const csvLink = {
        headers: posts.length > 0 ? Object.keys(posts[0]) : "",
        data: posts,
        filename: `post.csv`
    }

    const [emptyRows, setemptyRows] = useState(page > 0 ? Math.max(0, (1 + page) * rowsPerPage - postRow.length) : 0);


    useEffect(() => {
        setUserID(session?.user.id);
    })

    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const seachAction = () => {
        requestSearch(searchValue)
    }

    const handleClose = () => {
        setOpen(false);
    }

    const deleteAction = async (id: any) => {
        console.log(id);
        const body = { post_id: id, user_id: session?.user.id }

        fetch("http://localhost:3000/api/post/delete", {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body)
        })
            .then((response) => response.json())
            .then((json) => {
                console.log(json);
                json.success ? (router.replace(router.asPath), setOpen(true)) : null
            })
    }

    const requestSearch = (searchedVal: string) => {
        const filteredRows = posts.filter((row) => {
            return row.title.toLowerCase().includes(searchedVal.toLowerCase());
        });
        setpostRow(filteredRows);
        setemptyRows(page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredRows.length) : 0)
    }

    const cancelSearch = () => {
        setSearchValue("");
        setpostRow(posts)
    }

    const handleAlertClose = () => {
        setAlertOpen(false);
    }

    const handleFileUpload = (e) => {
        console.log("file selector!!!");

        if (!e.target.files) {
            return;
        }
        const file = e.target.files[0];
        setFile(file)
        setAlertOpen(true)
    }

    const handleAlertOk = () => {
        setAlertOpen(false);
        let body = new FormData();
        console.log(userID);

        body.append("user_id", userID);
        body.append("file", file);
        fetch("http://localhost:3000/api/post/upload/csv", {
            method: "POST",
            headers: {
            },
            body: body
        })
            .then((response) => response.json())
            .then((json) => {
                json.success ? (setsuccess(true), setmessage(json.message), router.replace(router.asPath)) : null
            })
    }

    return (
        <>
            <Header></Header>
            <div className="container my-5 d-flex flex-column">
                <h2 className='text-info mb-2'>Post Lists</h2>
                <div className="row d-flex flex-row mb-5 mx-0 align-items-center p-2">
                    <style jsx>{`
                        .searbar-w {
                            // width: 30rem;
                            height: 2.5rem;
                            margin: 0px !important;
                        }
                        .search-btn {
                            height: 2.5rem;
                            // width: 8rem
                        }
                    `}</style>
                    <SearchBar
                        className="col-6 my-2 searbar-w px-3"
                        value={searchValue}
                        onChange={(searchVal) => requestSearch(searchVal)}
                        onCancelSearch={() => cancelSearch()}
                    />
                    <button type="button" className="col-1 btn btn-info text-white mx-4 search-btn" onClick={() => seachAction()}>
                        Search
                    </button>
                    <button type="button" className="col-1 btn btn-info text-white mx-4 search-btn" onClick={() => router.push("/post/add")}>
                        Add
                    </button>
                    <label className='col-1 mx-4 search-btn p-0' htmlFor="contained-button-file">
                        <Input accept=".csv" id="contained-button-file" multiple type="file" onChange={e => handleFileUpload(e)} />
                        <Button variant="contained" className='h-100 btn-info' component="span" disableRipple fullWidth>
                            Upload
                        </Button>
                    </label>
                    <div className="col-1 btn btn-info text-white mx-4 search-btn">
                        <CSVLink {...csvLink}>Download</CSVLink>
                    </div>
                </div>
                {posts.length > 0 ? <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="custom pagination table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="left">Post Title</TableCell>
                                <TableCell align="left">Post Description</TableCell>
                                <TableCell align="left">Posted User</TableCell>
                                <TableCell align="left">Posted Date</TableCell>
                                <TableCell align="left"></TableCell>
                                <TableCell align="left"></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(rowsPerPage > 0
                                ? postRow.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : postRow).map((data, idx) => {
                                    return <TableRow
                                        key={idx}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {data.title}
                                        </TableCell>
                                        <TableCell component="th" scope="row">{data.description}</TableCell>
                                        <TableCell align="left">{data.created_user_id?.name}</TableCell>
                                        <TableCell align="left">{format(new Date(data.created_at), 'MM/dd/yyyy')}</TableCell>
                                        <TableCell align="left">
                                            <button type="button" className="btn btn-info text-white m-2 search-btn" onClick={() => router.push({ pathname: "/post/edit", query: { postId: data._id } })}>
                                                Edit
                                            </button>
                                        </TableCell>
                                        <TableCell align="left">
                                            <button type="button" className="btn btn-danger text-white m-2 search-btn" onClick={() => deleteAction(data._id)}>
                                                Delete
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                })}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 53 * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <style jsx global>{`
                                    p {
                                    margin: 0
                                    }
                                `}</style>
                                <TablePagination
                                    align='center'
                                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                    colSpan={6}
                                    count={posts.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    SelectProps={{
                                        inputProps: {
                                            'aria-label': 'rows per page',
                                        },
                                        native: true,
                                    }}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    ActionsComponent={TablePaginationActions}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
                    : <h1 className='text-warning align-self-center my-5'>There is no Post at this time.</h1>}

            </div>
            <Snackbar open={open} autoHideDuration={6000}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    successfully deleted
                </Alert>
            </Snackbar>
            <Snackbar open={success} autoHideDuration={6000}>
                <Alert onClose={() => setsuccess(false)} severity="success" sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
            <Dialog
                open={alertopen}
                onClose={handleAlertClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Import CSV data to Post list?"}
                </DialogTitle>
                <DialogActions>
                    <Button onClick={handleAlertClose}>Cancle</Button>
                    <Button onClick={handleAlertOk} autoFocus>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export const getServerSideProps = async (ctx) => {
    const session: any = await getSession(ctx)
    if (!session) {
        return {
            redirect: {
                permanent: false,
                destination: '/'
            }
        }
    } else {
        await connectMongo();
        const allpost = await Posts.find({ status: 1 }).populate({ path: 'created_user_id', model: 'User', select: 'name type -_id' }).sort({ created_at: -1 })
        return {
            props: {
                posts: allpost.length > 0 ? JSON.parse(JSON.stringify(allpost)) : []
            }
        }
    }
}

export default Post