
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Grouping/X3DGroupingNode",
	"cobweb/Bits/X3DCast",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Vector3",
	"standard/Math/Geometry/Box3",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DGroupingNode, 
          X3DCast,
          X3DConstants,
          Vector3,
          Box3)
{
	with (Fields)
	{
		var defaultBBoxSize = new Vector3 (-1, -1, -1);
	
		function Switch (executionContext)
		{
			X3DGroupingNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .Switch);

			this .addAlias ("choice", this .children_);
		}

		Switch .prototype = $.extend (new X3DGroupingNode (),
		{
			constructor: Switch,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",       new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "whichChoice",    new SFInt32 (-1)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxSize",       new SFVec3f (-1, -1, -1)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxCenter",     new SFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOnly,      "addChildren",    new MFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,      "removeChildren", new MFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "children",       new MFNode ()),
			]),
			getTypeName: function ()
			{
				return "Switch";
			},
			getComponentName: function ()
			{
				return "Grouping";
			},
			getContainerField: function ()
			{
				return "children";
			},
			initialize: function ()
			{
				X3DGroupingNode .prototype .initialize .call (this);
				
				this .whichChoice_ .addInterest (this, "set_whichChoice__");
				
				this .set_whichChoice__ ();
			},
			set_whichChoice__: function ()
			{
				var whichChoice = this .whichChoice_ .getValue ();

				if (whichChoice >= 0 && whichChoice < this .children_ .length)
				{
					var child = this .children_ [whichChoice];

					if (child)
					{
						child = child .getValue ();
						this .traverse = child .traverse .bind (child);
						return;
					}
				}
	
				this .taverse = function () { };
			},
			getBBox: function () 
			{
				if (this .bboxSize_ .getValue () .equals (defaultBBoxSize))
				{
					var whichChoice = this .whichChoice_ .getValue ();
				
					if (whichChoice >= 0 && whichChoice < this .children_ .length)
					{
						var child = X3DCast (X3DConstants .X3DBoundedObject, this .children_ [whichChoice]);

						if (child)
							return child .getBBox ();
					}

					return new Box3 ();
				}

				return new Box3 (this .bboxSize_ .getValue (), this .bboxCenter_ .getValue ());
			},
		});

		return Switch;
	}
});

