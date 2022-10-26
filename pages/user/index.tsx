import Header from '../../components/Header';
import connectMongo from '../../utils/dbConnect';
import Users from '../../models/user.model';
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TableFooter, TablePagination, Box, Paper, IconButton, useTheme
} from '@mui/material';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { useRouter } from 'next/router';
import SearchBar from "material-ui-search-bar";
import Link from 'next/link';
import { getSession, useSession } from 'next-auth/react';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { API_URI } from 'utils/constants';

interface TablePaginationActionsProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (
        event: React.MouseEvent<HTMLButtonElement>,
        newPage: number,
    ) => void;
}

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

function UserList({ users }) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchValue, setSearchValue] = useState("")
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [userRow, setuserRow] = useState(users);
    const { data: session }: any = useSession();

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;

    useEffect(() => {
        console.log(session?.user?._id);

    }, [session])

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

    const deleteAction = (id) => {
        const body = { id: id, deleted_user_id: session?.user?._id }

        fetch(API_URI + "api/user/delete", {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body)
        })
            .then((response) => response.json())
            .then((json) => {
                json.status == 'success' ? (router.reload(), setOpen(true)) : null
            })
    }

    const requestSearch = (searchedVal: string) => {
        const filteredRows = users.filter((row) => {
            return row.name.toLowerCase().includes(searchedVal.toLowerCase());
        });
        setuserRow(filteredRows);
    };

    const cancelSearch = () => {
        setSearchValue("");
        setuserRow(users)
    };

    return (
        <>
            <Header></Header>
            <div className="container my-5 d-flex flex-column">
                <h2 className='text-info mb-2'>User Lists</h2>
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
                    {/* <input id="search" placeholder="Search" type="text" name="search" required autoComplete="text"
                        onChange={e => setSearchValue(e.target.value)} /> */}
                    <button type="button" className="col btn btn-info text-white mx-4 search-btn" onClick={() => seachAction()}>
                        Search
                    </button>
                    <button type="button" className="col btn btn-info text-white mx-4 search-btn" onClick={() => router.push("/user/add")}>
                        Add
                    </button>
                    <div className="col"></div>
                    <div className="col"></div>

                </div>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="custom pagination table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="left" className='text-info fw-bold h6'>Name</TableCell>
                                <TableCell align="left" className='text-info fw-bold h6'>Email</TableCell>
                                <TableCell align="left" className='text-info fw-bold h6'>Created User</TableCell>
                                <TableCell align="left" className='text-info fw-bold h6'>Phone</TableCell>
                                <TableCell align="left" className='text-info fw-bold h6'>Birth Date</TableCell>
                                <TableCell align="left" className='text-info fw-bold h6'>Address</TableCell>
                                <TableCell align="left" className='text-info fw-bold h6'>Created Date</TableCell>
                                <TableCell align="left" className='text-info fw-bold h6'>Updated Date</TableCell>
                                <TableCell align="left"></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(rowsPerPage > 0
                                ? userRow.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : userRow).map((data, idx) => {
                                    return <TableRow
                                        key={idx}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {session?.user?._id == data._id ?
                                                <Link href="/user/profile">
                                                    <a style={{ textDecoration: "underline", color: "blue" }}>{data.name}</a>
                                                </Link>
                                                :
                                                <Link href={'/user/detail?userId=' + data._id}>
                                                    <a style={{ textDecoration: "underline", color: "blue" }}>{data.name}</a>
                                                </Link>
                                            }
                                        </TableCell>
                                        <TableCell component="th" scope="row">{data.email}</TableCell>
                                        <TableCell component="th" scope="row">{data.created_user_id?.name}</TableCell>
                                        <TableCell align="left">{data.phone}</TableCell>
                                        <TableCell align="left">{data.dob ? format(new Date(data.dob), 'MM/dd/yyyy') : null}</TableCell>
                                        <TableCell align="left">{data.address}</TableCell>
                                        <TableCell align="left">{format(new Date(data.created_at), 'MM/dd/yyyy')}</TableCell>
                                        <TableCell align="left">{format(new Date(data.updated_at), 'MM/dd/yyyy')}</TableCell>
                                        <TableCell align="left">
                                            {
                                                session?.user?._id !== data._id ?
                                                    <button type="button" className="btn btn-danger text-white m-2 search-btn" onClick={() => deleteAction(data._id)}>
                                                        Delete
                                                    </button>
                                                    : null
                                            }

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
                                    align="center"
                                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                    colSpan={9}
                                    count={users.length}
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
                    </Table></TableContainer>
            </div>
            <Snackbar open={open} autoHideDuration={6000}>
                <Alert onClose={() => setOpen(false)} severity="success" sx={{ width: '100%' }}>
                    This is a success message!
                </Alert>
            </Snackbar>
        </>
    )
}

export const getServerSideProps = async (ctx) => {
    const session: any = await getSession(ctx)
    if (!session || session?.user?.type == 1) {
        return {
            redirect: {
                permanent: false,
                destination: '/'
            }
        }
    } else {
        let data;
        await fetch(API_URI + "api/user?id=" + session.user._id, {
            method: "GET",
        })
            .then((response) => response.json())
            .then((json) => {
                data = json
            })
        return {
            props: {
                users: data.status == "success" ? data.data : []
            }
        }
        // const alluser = await Users.find().populate({ path: 'created_user_id', model: 'User', select: 'name type -_id' }).sort({ created_at: -1 })
        // return {
        //     props: {
        //         users: JSON.parse(JSON.stringify(alluser))
        //     }
        // }
    }
}

export default UserList