var newBlock = require('./new-block.js');

var lgLogic = require('./_lg-logic');

/**
 * lost-waffle: Creates a block that is a fraction of the size of its
 * containing element's width AND height with a gutter on the right
 * and bottom.
 *
 * @param {string} [fraction] - This is a simple fraction of the containing
 *   element's width and height.
 *
 * @param {integer} [cycle] - Lost works by assigning a margin-right/bottom
 *   to all elements except the last row (no margin-bottom) and the last
 *   column (no margin-right). It does this by default by using the
 *   denominator of the fraction you pick. To override this default use this
 *   param., e.g.: .foo { lost-waffle: 2/4 2; }
 *
 * @param {length} [gutter] - The margin on the right and bottom side of the
 *   element used to create a gutter. Typically this is left alone and the
 *   global $gutter will be used, but you can override it here if you want
 *   certain elements to have a particularly large or small gutter (pass 0
 *   for no gutter at all).
 *
 * @param {string} [float-right] - Tells whether or not the cycle should float right
 *
 * @param {string} [flex|no-flex] - Determines whether this element should
 *   use Flexbox or not.
 *
 * @param {string} [ltr|rtl] - Determines whether this element should
 *   use standard left-to-right or right-to-left layout.
 *
 * @example
 *   section {
 *     height: 100%;
 *   }
 *   div {
 *     lost-waffle: 1/3;
 *   }
 */
module.exports = function lostWaffleDecl(css, settings, result) {
  css.walkDecls('lost-waffle', function lostWaffleDeclFunction(decl) {
    var declArr = [];
    var gridDirection = settings.direction;
    var lostWaffle;
    var floatRight;
    var lostWaffleCycle;
    var unit = settings.gridUnit;
    var lostWaffleRounder = settings.rounder;
    var lostWaffleGutter = settings.gutter;
    var lostWaffleFlexbox = settings.flexbox;
    var validUnits = ['%', 'vh', 'vw'];
    var left = (gridDirection === 'ltr') ? 'left' : 'right';
    var right = (gridDirection === 'ltr') ? 'right' : 'left';

    function cloneAllBefore(props) {
      Object.keys(props).forEach(function traverseProps(prop) {
        decl.cloneBefore({
          prop: prop,
          value: props[prop]
        });
      });
    }

    declArr = decl.value.split(' ');
    
    if (settings.cycle === 'auto') {
      lostWaffleCycle = declArr[0].split('/')[1];
    } else {
      lostWaffleCycle = settings.cycle;
    }

    lostWaffle = declArr[0];

    if (declArr[1] !== undefined && declArr[1].search(/^\d/) !== -1) {
      lostWaffleCycle = declArr[1];
    }

    if (declArr[1] === 'flex' || declArr[1] === 'no-flex' || declArr[1] === 'auto') {
      lostWaffleCycle = declArr[0].split('/')[1];
    }

    if (declArr[2] !== undefined && declArr[2].search(/^\d/) !== -1) {
      lostWaffleGutter = declArr[2];
    }

    if (declArr.indexOf('flex') !== -1) {
      lostWaffleFlexbox = 'flex';
    }

    if (declArr.indexOf('no-flex') !== -1) {
      lostWaffleFlexbox = 'no-flex';
    }

    if (declArr.indexOf('float-right') !== -1) {
      floatRight = true;
    }

    if (declArr.indexOf('rtl') !== -1) {
      gridDirection = 'rtl';
      left = 'right';
      right = 'left';
    }

    decl.parent.nodes.forEach(function lostWaffleRounderFunction(declaration) {
      if (declaration.prop === 'lost-waffle-rounder') {
        lostWaffleRounder = declaration.value;
        declaration.remove();
      }
    });

    decl.parent.nodes.forEach(function lostWaffleCycleFunction(declaration) {
      if (declaration.prop === 'lost-waffle-cycle') {
        lostWaffleCycle = declaration.value;

        declaration.remove();
      }
    });

    decl.parent.nodes.forEach(function lostWaffleGutterFunction(declaration) {
      if (declaration.prop === 'lost-waffle-gutter') {
        lostWaffleGutter = declaration.value;

        declaration.remove();
      }
    });

    decl.parent.nodes.forEach(declaration => {
      if (declaration.prop === 'lost-unit') {
        if (lgLogic.validateUnit(declaration.value, validUnits)) {
          unit = declaration.value;
        } else {
          decl.warn(result, `${declaration.value} is not a valid unit for lost-waffle`);
        }
        declaration.remove();
      }
    });

    decl.parent.nodes.forEach(function lostWaffleFlexboxFunction(declaration) {
      if (declaration.prop === 'lost-waffle-flexbox') {
        if (declaration.prop === 'flex') {
          lostWaffleFlexbox = 'flex';
        }

        declaration.remove();
      }
    });

    if (lostWaffleFlexbox === 'flex') {
      decl.cloneBefore({
        prop: 'flex-grow',
        value: '0'
      });
      decl.cloneBefore({
        prop: 'flex-shrink',
        value: '0'
      });

      if (lostWaffleCycle !== 0) {
        newBlock(
          decl,
          ':nth-last-child(-n + ' + lostWaffleCycle + ')',
          ['margin-bottom'],
          [0]
        );

        newBlock(
          decl,
          ':nth-child(' + lostWaffleCycle + 'n)',
          ['margin-' + right, 'margin-' + left],
          [0, 'auto']
        );
      }

      decl.cloneBefore({
        prop: 'flex-basis',
        value: lgLogic.calcValue(lostWaffle, lostWaffleGutter, lostWaffleRounder)
      });

      newBlock(
        decl,
        ':last-child',
        ['margin-' + right, 'margin-bottom'],
        [0, 0]
      );

      newBlock(
        decl,
        ':nth-child(1n)',
        ['margin-' + right, 'margin-bottom', 'margin-' + left],
        [lostWaffleGutter, lostWaffleGutter, 0]
      );
    } else {
      if (lostWaffleCycle !== 0) {
        newBlock(
          decl,
          ':nth-last-child(-n + ' + lostWaffleCycle + ')',
          ['margin-bottom'],
          [0]
        );

        if (settings.clearing === 'left') {
          // FIXME: this doesn't make sense w/ rtl
          newBlock(
            decl,
            ':nth-child(' + lostWaffleCycle + 'n + 1)',
            ['clear'],
            [left]
          );
        } else {
          newBlock(
            decl,
            ':nth-child(' + lostWaffleCycle + 'n + 1)',
            ['clear'],
            ['both']
          );
        }

        // FIXME: this doesn't make sense w/ rtl
        if (floatRight === true) {
          newBlock(
            decl,
            ':nth-child(' + lostWaffleCycle + 'n)',
            ['margin-' + right, 'float'],
            [0, right]
          );
        } else {
          newBlock(
            decl,
            ':nth-child(' + lostWaffleCycle + 'n)',
            ['margin-' + right],
            [0]
          );
        }
      }

      newBlock(
        decl,
        ':last-child',
        ['margin-' + right, 'margin-bottom'],
        [0, 0]
      );

      newBlock(
        decl,
        ':nth-child(1n)',
        ['float', 'margin-' + right, 'margin-bottom', 'clear'],
        [left, lostWaffleGutter, lostWaffleGutter, 'none']
      );
    }

    cloneAllBefore({
      width: lgLogic.calcValue(lostWaffle, lostWaffleGutter, lostWaffleRounder, unit),
      height: lgLogic.calcValue(lostWaffle, lostWaffleGutter, lostWaffleRounder, unit)
    });

    decl.remove();
  });
};
