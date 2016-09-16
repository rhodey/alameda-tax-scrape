# alameda-tax-scrape

For a couple weeks in the summer of 2015 I became obcessed with the idea of
becoming an Oakland, California home owner through *[Adverse Possession](https://en.wikipedia.org/wiki/Adverse_possession)*.
Well that didn't happen (**not yet**), but what did happen was a lot of
interesting research and development of a few neat tools like this. One of the
main requirements for adverse possession is finding property with delinquent
property taxes; using the Alameda County Treasurer's website that's exactly
what this tool does.

## Setup
```
$ npm install
```

## Usage
Every peice of property in Alameda is assigned unique *"parcel number"* in the
form of `<a>-<b>-<c>`, where `a, b, &c` are integers. In this massive value
space it is not possible to know which parcel numbers are valid, there are some
patterns, but it is largely guess work. The script `scrape.js` requires four
arguments in the form of:

```
$ node scrape.js <a> <b> <c start> <c stop>
```

## Example
```
$ node scrape.js 5 465 1 10
```

## License

Copyright 2016 An Honest Effort LLC
