import logo from './logo.svg';

import React from "react";
import './App.css';

class App extends React.Component {

  // Constructor 
  constructor() {
    super();

    this.state = {
      students: [],
      DataisLoaded: false,
      searchVal: "",
      tagVal: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleTagChange = this.handleTagChange.bind(this);
  }

  componentDidMount() {
    fetch(
      "https://api.hatchways.io/assessment/students")
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          students: json.students,
          DataisLoaded: true
        });
      })
  }

  handleChange(e) {
    this.setState({
      searchVal: e.target.value
    })
  }

  handleTagChange(e) {
    this.setState({
      tagVal: e.target.value
    })
  }

  tagTextboxChange = (index, event) => {
    const inputVal = event.target.value;
    let users = [...this.state.students];
    users[index].tagtextbox = inputVal;
    this.setState({
      students: users
    });
  }

  enterPress = (index, event) => {
    const inputVal = event.target.value;
    let users = [...this.state.students];


    if (event.key == "Enter" && inputVal) {
      users[index].tagtextbox = '';
      if (!users[index].tags) {
        users[index].tags = [];
      }
      users[index].tags.push(inputVal);
      this.setState({
        students: users
      });
    }

  }

  btnCliked = (index) => {
    let users = [...this.state.students];
    users[index].btnStatus = !users[index].btnStatus;
    this.setState({
      students: users
    });
  }

  getAverage(grades) {
    let sum = 0;
    grades.forEach(grade => {
      sum += parseFloat(grade);
    });
    return sum / grades.length;
  }




  render() {
    const DataisLoaded = this.state.DataisLoaded;
    if (!DataisLoaded) return <div>
      <h1> Pleses wait some time.... </h1> </div>
    let users = this.state.students;

    let searchName = this.state.searchVal.trim().toLowerCase();
    if (searchName.length > 0) {
      users = users.filter(function (student) {
        return student.firstName.toLowerCase().startsWith(searchName) || student.lastName.toLowerCase().startsWith(searchName)
      })

    }

    let tagName = this.state.tagVal.trim().toLowerCase();
    if (tagName.length > 0) {
      users = users.filter((student) => {
        if (student.tags) {
          let tagfound = false;;
          student.tags.forEach(tag => {
            if ((tag.toLowerCase()).startsWith(tagName.toLowerCase())) {
              tagfound = true;
            }
          });
          if (tagfound) {
            return student;
          }
        }
      })
    }

    return (
      <div className="App">

        {/* <div className="card ">
          <div className="fifth">
            <h2 className="sixth">Which of the below statements about electricity is not true?</h2>
            <p className="first" >
              <label className="rdbutton" htmlFor="option_1">Eletricity is measured in units called watts
                <input className="" type="radio" id="option_1" name="op_1" value="Eletricity is measured in units called watts"></input>
                <span className="checkmark"></span>
              </label>
            </p>

            <p className="second"><label className="rdbutton" htmlFor="option_2">Eletricity flows at the speed of light
              <input className="" type="radio" id="option_2" name="op_1" value="Eletricity flows at the speed of light"></input>
              <span className="checkmark"></span>

            </label>
            </p>
            <p className="third">
              <label className="rdbutton" htmlFor="option_3">Eletricity is primary energy source
                <input className="" type="radio" id="option_3" name="op_1" value="Eletricity is primary energy source"></input>
                <span className="checkmark fourth"></span>
              </label>
            </p>
          </div>
        </div> */}


        <div className="container">

          <input className="inputBox" type="search" id="gsearch" name="gsearch" placeholder='Search by name' value={this.state.searchVal} onChange={this.handleChange} />
          <input className="d-block inputBox" type="search" id="gtag" name="gtag" placeholder='Tag by name' value={this.state.tagVal} onChange={this.handleTagChange} />
          {
            users.map((user, index) => (
              <div className="card" key={index}>
                <div className="row g-0">
                  <div className="col-md-2 img-style">
                    <img src={user.pic} className="img-fluid" alt="..." />
                  </div>
                  <div className="col-md-10">
                    <div className="row">
                      <div className='col-md-9'>
                        <div className="card-body">
                          <StudentCard databank={user} pic={user.pic} name={user.firstName + " " + user.lastName} email={user.email} company={user.company} skill={user.skill} average={this.getAverage(user.grades)} tests={user.grades} />
                          {
                            user.btnStatus ?
                              (<>
                                <div className="collapse show ps-1 pt-1" id="navbarToggleExternalContent">
                                  {
                                    user.grades.map((test, stuindex) => (
                                      <p className="mb-0" key={stuindex + "-student"}>Test-{stuindex + 1} : {test}%</p>
                                    ))
                                  }
                                </div>

                              </>)
                              :
                              <>
                                <div className="collapse" id="navbarToggleExternalContent">
                                  {
                                    user.grades.map((test, stuindex) => (
                                      <p className="mb-0" key={stuindex + "-student"}>Test-{stuindex + 1} : {test}%</p>
                                    ))
                                  }
                                </div></>
                          }
                        </div>
                      </div>
                      <div className='col-md-2'>
                        <nav className="navbar coll">
                          <div className="container-fluid">
                            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" aria-controls="navbarToggleExternalContent" aria-expanded="false" aria-label="Toggle navigation" onClick={this.btnCliked.bind(this, index)}>
                              {
                                user.btnStatus ?
                                  (<><i className="bi bi-dash"></i>
                                  </>)
                                  :
                                  <> <i className="bi bi-plus"></i>
                                  </>
                              }

                            </button>
                          </div>
                        </nav>
                      </div>
                    </div>
                    <div >

                    </div>

                    <div className=' tagContainer'>
                      {
                        user.tags ? user.tags.map((tag, tagindex) => (

                          <span className='tagStyle' key={tagindex + "-" + index}>{tag}</span>

                        )) : ""
                      }
                    </div>
                    <input type="text" className="d-block ms-4" value={user.tagtextbox} placeholder='Add a tag' onChange={this.tagTextboxChange.bind(this, index)} onKeyDown={this.enterPress.bind(this, index)} />
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div >
    );
  }
}

function StudentCard(props) {

  return <>
    <div className="coll-menu">
      <h1 className="card-title fw-bolder pb-2 title-name">{props.name}</h1>
    </div>

    <div className="ps-2">
      <p className="card-text mb-0">Email: {props.email}</p>
      <p className="card-text mb-0">Company: {props.company}</p>
      <p className="card-text mb-0">Skill: {props.skill}</p>
      <p className="card-text mb-0">Average: {props.average}%</p>

    </div>
  </>


}
export default App;
