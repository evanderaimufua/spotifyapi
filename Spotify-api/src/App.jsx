import "./App.css";
import { FormControl, InputGroup, Container, Button, NavbarBrand,Row,Card } from "react-bootstrap";
import { useState, useEffect } from "react";

const clientId = import.meta.env.VITE_CLIENT_ID;
const clientSecret = import.meta.env.VITE_CLIENT_SECRET;

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
   const [albums, setAlbums] = useState([]);

  useEffect(() => {
    let authParams = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body:
        "grant_type=client_credentials&client_id=" +
        clientId +
        "&client_secret=" +
        clientSecret,
    };
    fetch("https://accounts.spotify.com/api/token", authParams)
      .then((result) => result.json())
      .then((data) => {
        setAccessToken(data.access_token);
      });
  }, []);

  async function search() {
    let artistParams = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    };

    // Get Artist
    const artistID = await fetch(
      "https://api.spotify.com/v1/search?q=" + searchInput + "&type=artist",
      artistParams
    )
      .then((result) => result.json())
      .then((data) => {
        return data.artists.items[0].id;
      });
    
    //Get artist Albums
    await fetch("https://api.spotify.com/v1/artists/" + artistID + "/albums?include_groups=album&market=US&limit=50", artistParams)
      .then((result) => result.json())
      .then((data) => {
        setAlbums(data.items);
      });
  }

  return (
    <>
     
      <NavbarBrand> 
        <Container>
          <a className="navbar-brand" href="#">
            <img  src="https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg" 
            alt="Spotify" 
            width="30" 
            height="30">
            </img>
          </a>
          <h3> Find An Artist Album</h3>
        </Container>
      </NavbarBrand>
      <Container>
        <InputGroup>
          <FormControl
            placeholder="Search For Artist"
            type="input"
            aria-label="Search for an Artist"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                search();
              }
            }}
            onChange={(event) => setSearchInput(event.target.value)}
            style={{
              width: "300px",
              height: "35px",
              borderWidth: "0px",
              borderStyle: "solid",
              borderRadius: "5px",
              marginRight: "10px",
              paddingLeft: "10px",
            }}
          />

          <Button onClick={search}>Search</Button>
        </InputGroup>
      </Container>
      <Container>
        <Row
          style={{
            paddingTop: "20px",
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-around",
            alignContent:"center",
          }}
        >
          {  albums.map((album) => {
            return (
              <Card
                key={album.id}
                style={{
                  backgroundColor: "white",
                  margin: "10px",
                  borderRadius: "5px",
                  marginBottom: "30px",
                }}>
                <Card.Img
                  width={240}
                  src={album.images[0].url}
                  style={{
                    //width: '100%',
                    borderRadius: '5%',
                  }}
                />
                <Card.Body>
                  <Card.Title
                    style={{
                      whiteSpace: 'wrap',
                      fontWeight: 'bold',
                      maxWidth: '200px',
                      fontSize: '18px',
                      marginTop: '10px',
                      color: 'black'
                    }}>
                    {album.name}
                  </Card.Title>
                  <Card.Text
                    style={{ color: 'black' }}
                  >Release Date: <br />{album.release_date}
                  </Card.Text>
                  <Button
                    href={album.external_urls.spotify} style={{
                      backgroundColor: 'black',
                      color: 'white',
                      fontWeight: 'Bold',
                      fontSize: '15px',
                      borderRadius: '4px',
                      padding: '10px',


                    }}>
                    Album Link
                  </Button>
                </Card.Body>
              </Card>
            );
            })
        }
          
        </Row>
      </Container>
    </>
  );
}

export default App;