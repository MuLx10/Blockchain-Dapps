

web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
asciiToHex = Web3.utils.asciiToHex;
contractInstance = new web3.eth.Contract(ABI_DEFINITION, CONTRACT_ADDRESS);

candidates = {"Mehul": "candidate-1", "Sayan": "candidate-2", "Vernwal": "candidate-3"}

function voteForCandidate() {
  candidateName = $("#candidate").val();
  web3.eth.getAccounts()
  .then((accounts) => {
    return contractInstance.methods.voteForCandidate(asciiToHex(candidateName)).send({from: accounts[0]})
  })
  .then(() => {
    return contractInstance.methods.totalVotesFor(asciiToHex(candidateName)).call();
  })
  .then((voteCount) => {
    const div_id = candidates[candidateName];
    $("#" + div_id).html(voteCount);
  });
}

$(document).ready(function() {
  Object.keys(candidates).forEach((name) => {
    contractInstance.methods.totalVotesFor(asciiToHex(name)).call()
    .then((val) => {
      $("#" + candidates[name]).html(val);
    });
  });
});
