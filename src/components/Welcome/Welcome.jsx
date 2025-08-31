import "./Welcome.scss";
import welcomeImg from "../../assets/images/welcome.png";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const Welcome = ({ setTab }) => {
  const handleWhereButtonClick = () => {
    setTab("where");
  };

  const handleChatButtonClick = () => {
    setTab("chat");
  };

  return (
    <div className="welcome">
      <Card className="welcome-card">
        <CardMedia
          component="img"
          image={welcomeImg}
          title="Welcome image"
          className="welcome-image"
        />
        <CardContent>
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            className="welcome-title"
          >
            SASHA'S 9 BIRTHDAY PARTY
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary" }}
            className="welcome-desc"
          >
            🎉 Sasha is turning 9 and you’re invited to the party on Saturday,
            Sept 6!🥳 There will be cheese pizza 🧀🍕, Hawaiian pizza
            🍍🍕🇮🇹(LOL) and a mountain of ice cream cake 🍦🍰 (because one sugar
            rush is never enough). Waivers are boring but parents can sign them
            online — just come ready for laughs, food, and chaos! 🚀
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="large" onClick={handleWhereButtonClick}>
            Where
          </Button>
          <Button size="large" onClick={handleChatButtonClick}>
            Chat
          </Button>
        </CardActions>
      </Card>
    </div>
  );
};

export default Welcome;
