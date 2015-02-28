
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Shape/X3DShapeNode",
	"cobweb/Bits/TraverseType",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Geometry/Box3",
	"standard/Math/Numbers/Vector3",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DShapeNode, 
          TraverseType,
          X3DConstants,
          Box3,
          Vector3)
{
	with (Fields)
	{
		function Shape (executionContext)
		{
			X3DShapeNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .Shape);
		}

		Shape .prototype = $.extend (new X3DShapeNode (),
		{
			constructor: Shape,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",   new SFNode ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxSize",   new SFVec3f (-1, -1, -1)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxCenter", new SFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "appearance", new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "geometry",   new SFNode ()),
			]),
			getTypeName: function ()
			{
				return "Shape";
			},
			getComponentName: function ()
			{
				return "Shape";
			},
			getContainerField: function ()
			{
				return "children";
			},
			getBBox: function ()
			{
				if (this .bboxSize_ .getValue () .equals (new Vector3 (-1, -1, -1)))
				{
					if (this .getGeometry ())
						return this .getGeometry () .getBBox ();

					return new Box3 ();
				}
				
				return new Box3 (this .bboxSize_, this .bboxCenter_);
			},
			traverse: function (type)
			{
				switch (type)
				{
					case TraverseType .POINTER:
					{
						//this .pointer ();
						break;
					}
					case TraverseType .NAVIGATION:
					case TraverseType .COLLISION:
					{
						//if (this .getGeometry ())
						//	this .getCurrentLayer () .addCollision (this);

						break;
					}
					case TraverseType .DISPLAY:
					{
						if (this .getGeometry ())
							this .getCurrentLayer () .addShape (this);

						break;
					}
				}
			},
			draw: function (context)
			{
				this .getAppearance () .traverse ();

				this .getGeometry () .traverse (context);
			},
		});

		return Shape;
	}
});

