
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Rendering/X3DCoordinateNode",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Geometry/Triangle",
	"standard/Math/Numbers/Vector3",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DCoordinateNode, 
          X3DConstants,
          Triangle,
          Vector3)
{
	with (Fields)
	{
		function Coordinate (executionContext)
		{
			X3DCoordinateNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .Coordinate);
		}

		Coordinate .prototype = $.extend (new X3DCoordinateNode (),
		{
			constructor: Coordinate,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata", new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "point",    new MFVec3f ()),
			]),
			getTypeName: function ()
			{
				return "Coordinate";
			},
			getComponentName: function ()
			{
				return "Rendering";
			},
			getContainerField: function ()
			{
				return "coord";
			},
			getPoint: function (index)
			{
				if (index < this .point_ .length)
					return this .point_ [index] .getValue ();

				return new Vector3 ();
			},
			getNormal: function (index1, index2, index3)
			{
				var length = this .point_ .length;

				if (index1 < length && index2 < length && index3 < length)
					return Triangle .normal (this .point_ [index1] .getValue (),
					                         this .point_ [index2] .getValue (),
					                         this .point_ [index3] .getValue ());

				return new Vector3 ();
			},
			getQuadNormal: function (index1, index2, index3, index4)
			{
				var length = this .point_ .length;

				if (index1 < length && index2 < length && index3 < length && index4 < length)
					return Triangle .quadNormal (this .point_ [index1] .getValue (),
					                             this .point_ [index2] .getValue (),
					                             this .point_ [index3] .getValue (),
					                             this .point_ [index4] .getValue ());

				return new Vector3 ();
			},
		});

		return Coordinate;
	}
});

