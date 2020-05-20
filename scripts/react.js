
class Book extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isHidden: true
        };
        this.change = this.change.bind(this);
    }

    change() {
        this.setState(state => ({
            isHidden: !state.isHidden
        }));
    }

    render() {
        return (
            (this.props.isEn)
                ?<div className="book">
                <p><b>Author: </b>{this.props.author}</p>
                <p><b>Title: </b>{this.props.title}</p>
                { this.state.isHidden
                  ? <p className="linkT" onClick={this.change}>Details...</p>
                  : <div><p ><b>Description: </b>{this.props.description}</p>
                         <p className="linkT" onClick={this.change}>Hide details</p>
                    </div>}
                </div>
                :<div className="book">
                    <p><b>Автор: </b> {this.props.author}</p>
                    <p><b>Назва: </b> {this.props.title}</p>
                    { this.state.isHidden
                        ? <p className="linkT" onClick={this.change}>Детальніше...</p>
                        : <div><p><b>Опис: </b>{this.props.description}</p>
                            <p className="linkT" onClick={this.change}>Сховати деталі</p>
                        </div>}
                </div>

    );
    }

}

function showBook(a, t, d, id, en){
    ReactDOM.render(<Book author = {a} title= {t} description = {d} isEn = {en}/>,
        document.getElementById(id));
}