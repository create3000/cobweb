
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
		var defaultBBoxSize = new Vector3 (-1, -1, -1);
	
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
			initialize: function ()
			{
				X3DShapeNode .prototype .initialize .call (this);

				this .bboxSize_   .addInterest (this, "set_bbox__");
				this .bboxCenter_ .addInterest (this, "set_bbox__");

				this .set_bbox__ ();
			},
			set_bbox__: function ()
			{
				if (this .bboxSize_ .getValue () .equals (defaultBBoxSize))
				{
					if (this .getGeometry ())
						this .bbox = this .getGeometry () .getBBox ();

					else
						this .bbox = new Box3 ();
				}
				else
					this .bbox = new Box3 (this .bboxSize_ .getValue (), this .bboxCenter_ .getValue ());
				
				this .bboxSize   = this .bbox .size;
				this .bboxCenter = this .bbox .center;
			},
			getBBox: function ()
			{
				return this .bbox;
			},
			getBBoxSize: function ()
			{
				return this .bboxSize;
			},
			getBBoxCenter: function ()
			{
				return this .bboxCenter;
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
				this .getGeometry ()   .traverse (context);
			},
		});

		return Shape;
	}
});

