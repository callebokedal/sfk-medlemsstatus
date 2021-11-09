let year = new Date().getFullYear();
let age = (birthDate) => {
    return (year - birthDate.substring(0,4)) + " år";
}

// From group name to object representing the groups
let groupToObject = (name) => {
    let hidden = _.isEmpty(name) || _.startsWith(name, 'MC_') || _.startsWith(name, 'Ignorera_');
    const familyPattern = /.+ \[\d+\]/;
    let family = name.match(familyPattern);
    return {name: name, hidden: hidden, family: family};
}

// From role name to object representing the role
let roleToObject = (name) => {
    // Skip 'Medlem' - since all members also have 'Aktiv - xxx'!?
    //let hidden = name == 'Medlem' || !_.startsWith(name, 'Aktiv - ');
    let hidden = name != 'Medlem' && !_.startsWith(name, 'Aktiv - ');
    return {name: _.replace(name, 'Aktiv - ', ''), hidden: hidden, fullname: name, member: name == 'Medlem'};
}

/*let markMemberStatus = (person) => {
    let groups = _.map(_.split(o.groups, ','), _.trim);

}*/

let markIngenTidning = (person) => {
    //let noPaper = _.map(_.split(o.groups, ','), _.trim).includes('MC_IngenTidning');
    if(_.map(_.split(person.groups, ','), _.trim).includes('MC_IngenTidning')) {
        person.print = false;
        person.nopaper = 'MC_IngenTidning';
    };
    return person;
}

let markFamilyRepresentant = (person, idx, persons) => {
    //console.log("markFamilyRepresentant");
    //console.log("markFamilyRepresentant ", person, idx, persons);
    if(person.family) {
        // Find first (printable) index for this family
        let firstFamilyIndex = _.findIndex(persons, function(p) { 
            return person.print && p.family == person.family; 
            //return p.print && p.family == person.family; 
        });
        // Get first stored family head
        let familyIndex = _.findIndex(persons, function(p) { 
            return p.family == person.family && p.familyHead == firstFamilyIndex; 
        });
        if(firstFamilyIndex >= 0 && familyIndex < 0) {
            // Set as family head
            person.print = true;
            person.familyHead = firstFamilyIndex;
        } else { //if(firstFamilyIndex >= 0 && familyIndex >= 0) {
            // Set as duplicate for this family
            person.print = false;
            person.familyMember = true;
        }
    } 
    return person;
}

let markOnePerHousehold = (person, idx, persons) => {
    //console.log("markOnePerHousehold");
    let householdKey = person.householdKey;
    if(householdKey) {
        // Find first (printable) household key
        // -1 for no hit, else 0+
        let firstHouseholdIndex = _.findIndex(persons, function(p) { 
            return person.print && p.householdKey == householdKey; 
        });
        if(debug) {
            //console.log("firstHouseholdIndex: ", firstHouseholdIndex);
        }
        // Get current persons idx
        // -1 for no hit, else 0+
        let householdIndex = _.findIndex(persons, function(p) { 
            return p.householdKey == householdKey && p.householdHead == firstHouseholdIndex; 
        });
        if(debug) {
            //console.log("householdIndex: ", householdIndex);
            console.log("person: ", person.name, householdKey, householdIndex, firstHouseholdIndex)
        }
        if(firstHouseholdIndex >= 0 && householdIndex < 0) {
            // Set as household head
            person.print = person.print && true;
            person.householdHead = firstHouseholdIndex;
        } else {
            // Set as duplicate for this household
            person.print = false;
            person.householdMember = true;
        }
    } /*else {
        person.print = false;
        person.invalid = true;
    }*/
    return person;
};